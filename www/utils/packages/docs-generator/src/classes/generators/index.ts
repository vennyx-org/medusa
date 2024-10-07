import ts from "typescript"
import Formatter from "../helpers/formatter.js"
import KindsRegistry from "../kinds/registry.js"
import GeneratorEventManager from "../helpers/generator-event-manager.js"
import { CommonCliOptions } from "../../types/index.js"
import { existsSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import getBasePath from "../../utils/get-base-path.js"
import getMonorepoRoot from "../../utils/get-monorepo-root.js"

export type Options = {
  paths: string[]
  dryRun?: boolean
} & Pick<CommonCliOptions, "generateExamples">

abstract class AbstractGenerator {
  protected options: Options
  protected program?: ts.Program
  protected checker?: ts.TypeChecker
  protected formatter: Formatter
  protected kindsRegistry?: KindsRegistry
  protected generatorEventManager: GeneratorEventManager

  constructor(options: Options) {
    this.options = options
    this.formatter = new Formatter()
    this.generatorEventManager = new GeneratorEventManager()
  }

  init() {
    const files: string[] = []

    this.options.paths.forEach((optionPath) => {
      if (!existsSync(optionPath)) {
        return
      }

      if (!statSync(optionPath).isDirectory()) {
        files.push(optionPath)
        return
      }

      // read files recursively from directory
      files.push(
        ...readdirSync(optionPath, {
          recursive: true,
          encoding: "utf-8",
        })
          .map((filePath) => path.join(optionPath, filePath))
          .filter((filePath) => !statSync(filePath).isDirectory())
      )
    })

    this.program = ts.createProgram(files, this.getBaseCompilerOptions())

    this.checker = this.program.getTypeChecker()

    const { generateExamples } = this.options

    this.kindsRegistry = new KindsRegistry({
      checker: this.checker,
      generatorEventManager: this.generatorEventManager,
      additionalOptions: {
        generateExamples,
      },
    })
  }

  /**
   * Generate the docblock for the paths specified in the {@link options} class property.
   */
  abstract run(): void

  /**
   * Checks whether a file is included in the specified files.
   *
   * @param {string} fileName - The file to check for.
   * @returns {boolean} Whether the file can have docblocks generated for it.
   */
  isFileIncluded(fileName: string): boolean {
    const baseFilePath = getBasePath(fileName)
    return this.options.paths.some((path) =>
      baseFilePath.startsWith(getBasePath(path))
    )
  }

  /**
   * Reset the generator's properties for new usage.
   */
  reset() {
    this.program = undefined
    this.checker = undefined
  }

  getBaseCompilerOptions(): ts.CompilerOptions {
    const monorepoPath = getMonorepoRoot()
    const tsconfigBasePath = path.join(monorepoPath, "_tsconfig.base.json")

    const configStr = ts.sys.readFile(tsconfigBasePath)

    if (!configStr) {
      return {}
    }

    return ts.parseJsonConfigFileContent(
      JSON.parse(configStr),
      ts.sys,
      monorepoPath
    ).options
  }
}

export default AbstractGenerator
