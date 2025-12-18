import TranslationModuleService from "@services/translation-module"
import loadDefaults from "./loaders/defaults"
import loadConfig from "./loaders/config"
import { Module } from "@medusajs/framework/utils"

export const TRANSLATION_MODULE = "translation"

export default Module(TRANSLATION_MODULE, {
  service: TranslationModuleService,
  loaders: [loadDefaults, loadConfig],
})
