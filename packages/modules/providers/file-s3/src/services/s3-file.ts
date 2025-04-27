import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
  S3ClientConfigType,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  FileTypes,
  Logger,
  S3FileServiceOptions,
} from "@medusajs/framework/types"
import {
  AbstractFileProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import path from "path"
import { ulid } from "ulid"

type InjectedDependencies = {
  logger: Logger
}

interface S3FileServiceConfig {
  fileUrl: string
  accessKeyId?: string
  secretAccessKey?: string
  authenticationMethod?: "access-key" | "s3-iam-role"
  region: string
  bucket: string
  prefix?: string
  endpoint?: string
  cacheControl?: string
  downloadFileDuration?: number
  additionalClientConfig?: Record<string, any>
}

const DEFAULT_UPLOAD_EXPIRATION_DURATION_SECONDS = 60 * 60

export class S3FileService extends AbstractFileProviderService {
  static identifier = "s3"
  protected config_: S3FileServiceConfig
  protected logger_: Logger
  protected client_: S3Client

  constructor({ logger }: InjectedDependencies, options: S3FileServiceOptions) {
    super()

    const authenticationMethod = options.authentication_method ?? "access-key"

    if (
      authenticationMethod === "access-key" &&
      (!options.access_key_id || !options.secret_access_key)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Access key ID and secret access key are required when using access key authentication`
      )
    }

    this.config_ = {
      fileUrl: options.file_url,
      accessKeyId: options.access_key_id,
      secretAccessKey: options.secret_access_key,
      authenticationMethod: authenticationMethod,
      region: options.region,
      bucket: options.bucket,
      prefix: options.prefix ?? "",
      endpoint: options.endpoint,
      cacheControl: options.cache_control ?? "public, max-age=31536000",
      downloadFileDuration: options.download_file_duration ?? 60 * 60,
      additionalClientConfig: options.additional_client_config ?? {},
    }
    this.logger_ = logger
    this.client_ = this.getClient()
  }

  protected getClient() {
    // If none is provided, the SDK will use the default credentials provider chain, see https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-envvars.html
    const credentials =
      this.config_.authenticationMethod === "access-key"
        ? {
            accessKeyId: this.config_.accessKeyId!,
            secretAccessKey: this.config_.secretAccessKey!,
          }
        : undefined

    const config: S3ClientConfigType = {
      credentials,
      region: this.config_.region,
      endpoint: this.config_.endpoint,
      ...this.config_.additionalClientConfig,
    }

    return new S3Client(config)
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No file provided`)
    }

    if (!file.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No filename provided`
      )
    }

    const parsedFilename = path.parse(file.filename)

    // TODO: Allow passing a full path for storage per request, not as a global config.
    const fileKey = `${this.config_.prefix}${parsedFilename.name}-${ulid()}${
      parsedFilename.ext
    }`

    const content = Buffer.from(file.content, "binary")
    const command = new PutObjectCommand({
      // We probably also want to support a separate bucket altogether for private files
      // protected private_bucket_: string
      // protected private_access_key_id_: string
      // protected private_secret_access_key_: string

      ACL: file.access === "public" ? "public-read" : "private",
      Bucket: this.config_.bucket,
      Body: content,
      Key: fileKey,
      ContentType: file.mimeType,
      CacheControl: this.config_.cacheControl,
      // Note: We could potentially set the content disposition when uploading,
      // but storing the original filename as metadata should suffice.
      Metadata: {
        "x-amz-meta-original-filename": file.filename,
      },
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      this.logger_.error(e)
      throw e
    }

    return {
      url: `${this.config_.fileUrl}/${fileKey}`,
      key: fileKey,
    }
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config_.bucket,
      Key: file.fileKey,
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      // TODO: Rethrow depending on the error (eg. a file not found error is fine, but a failed request should be rethrown)
      this.logger_.error(e)
    }
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    // TODO: Allow passing content disposition when getting a presigned URL
    const command = new GetObjectCommand({
      Bucket: this.config_.bucket,
      Key: `${fileData.fileKey}`,
    })

    return await getSignedUrl(this.client_, command, {
      expiresIn: this.config_.downloadFileDuration,
    })
  }

  // Note: Some providers (eg. AWS S3) allows IAM policies to further restrict what can be uploaded.
  async getPresignedUploadUrl(
    fileData: FileTypes.ProviderGetPresignedUploadUrlDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!fileData?.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No filename provided`
      )
    }

    const fileKey = `${this.config_.prefix}${fileData.filename}`

    let acl: ObjectCannedACL | undefined
    if (fileData.access) {
      acl = fileData.access === "public" ? "public-read" : "private"
    }

    // Using content-type, acl, etc. doesn't work with all providers, and some simply ignore it.
    const command = new PutObjectCommand({
      Bucket: this.config_.bucket,
      ContentType: fileData.mimeType,
      ACL: acl,
      Key: fileKey,
    })

    const signedUrl = await getSignedUrl(this.client_, command, {
      expiresIn:
        fileData.expiresIn ?? DEFAULT_UPLOAD_EXPIRATION_DURATION_SECONDS,
    })

    return {
      url: signedUrl,
      key: fileKey,
    }
  }
}
