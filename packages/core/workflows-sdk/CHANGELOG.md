# @medusajs/workflows-sdk

## 2.7.1

### Patch Changes

- [#12027](https://github.com/medusajs/medusa/pull/12027) [`e180253d608103cd8dfba8fddd3af2ba6ff2455a`](https://github.com/medusajs/medusa/commit/e180253d608103cd8dfba8fddd3af2ba6ff2455a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(workflows-sdk,orchestrator): step skip on permanent failure

- [#12255](https://github.com/medusajs/medusa/pull/12255) [`c2fe3f152059b5c0323190e57ffed8f762efd4b7`](https://github.com/medusajs/medusa/commit/c2fe3f152059b5c0323190e57ffed8f762efd4b7) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: steps to return undefined and still chain the config method

- [#12196](https://github.com/medusajs/medusa/pull/12196) [`8618e6ee3843069ea189ea64d5191d93db52dc9d`](https://github.com/medusajs/medusa/commit/8618e6ee3843069ea189ea64d5191d93db52dc9d) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Properly handle workflow as step now that events are fixed entirely

- Updated dependencies [[`e180253d608103cd8dfba8fddd3af2ba6ff2455a`](https://github.com/medusajs/medusa/commit/e180253d608103cd8dfba8fddd3af2ba6ff2455a), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de), [`8618e6ee3843069ea189ea64d5191d93db52dc9d`](https://github.com/medusajs/medusa/commit/8618e6ee3843069ea189ea64d5191d93db52dc9d), [`1f73281ab88c064404ecf7cc9dd0977dfd369723`](https://github.com/medusajs/medusa/commit/1f73281ab88c064404ecf7cc9dd0977dfd369723)]:
  - @medusajs/orchestration@2.7.1
  - @medusajs/types@2.7.1
  - @medusajs/modules-sdk@2.7.1
  - @medusajs/utils@2.7.1

## 2.7.0

### Patch Changes

- [#11886](https://github.com/medusajs/medusa/pull/11886) [`ff3885500cdc49440ada8f92d355e9bfe1cd39b9`](https://github.com/medusajs/medusa/commit/ff3885500cdc49440ada8f92d355e9bfe1cd39b9) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: hooks auto-generated types to have precise input options

- [#11771](https://github.com/medusajs/medusa/pull/11771) [`72d2cf92075b3e0849251f233517e2972de1b19c`](https://github.com/medusajs/medusa/commit/72d2cf92075b3e0849251f233517e2972de1b19c) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: workflow retry interval race condition

- [#11891](https://github.com/medusajs/medusa/pull/11891) [`b1b3b484747a110f720d9c1d086696bbfba86bda`](https://github.com/medusajs/medusa/commit/b1b3b484747a110f720d9c1d086696bbfba86bda) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: Set pricing context hook

- [#11907](https://github.com/medusajs/medusa/pull/11907) [`cab6f3a8adc7d6d1f39db9f3191a5797e35bf56f`](https://github.com/medusajs/medusa/commit/cab6f3a8adc7d6d1f39db9f3191a5797e35bf56f) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add support for accessing step results via context

- [#11873](https://github.com/medusajs/medusa/pull/11873) [`13e159d8ad7ebb3e6977969b4bb10877d7bb7850`](https://github.com/medusajs/medusa/commit/13e159d8ad7ebb3e6977969b4bb10877d7bb7850) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflow-engine-\*): Prevent passing shared context reference and workflow.cancel

- Updated dependencies [[`74381addc3d6af42f0292e778948aabb60a6dad9`](https://github.com/medusajs/medusa/commit/74381addc3d6af42f0292e778948aabb60a6dad9), [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`72d2cf92075b3e0849251f233517e2972de1b19c`](https://github.com/medusajs/medusa/commit/72d2cf92075b3e0849251f233517e2972de1b19c), [`95e89a39f347c8af6a5960943af56965bc3a07ba`](https://github.com/medusajs/medusa/commit/95e89a39f347c8af6a5960943af56965bc3a07ba), [`c3440e5e3812e3d1c6b82e9d4e41287398451611`](https://github.com/medusajs/medusa/commit/c3440e5e3812e3d1c6b82e9d4e41287398451611), [`3dba58785fb2d8e79f1ea89daa9e4ab8810821c8`](https://github.com/medusajs/medusa/commit/3dba58785fb2d8e79f1ea89daa9e4ab8810821c8), [`0625f76cd4f040963829b61dcc70563e1d1b7070`](https://github.com/medusajs/medusa/commit/0625f76cd4f040963829b61dcc70563e1d1b7070), [`0cc306bf562d8f1f1f1c09d9658463e2c8def465`](https://github.com/medusajs/medusa/commit/0cc306bf562d8f1f1f1c09d9658463e2c8def465), [`cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2`](https://github.com/medusajs/medusa/commit/cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2), [`79cfc1a69ee166fec298aa706b994253a1284520`](https://github.com/medusajs/medusa/commit/79cfc1a69ee166fec298aa706b994253a1284520), [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c), [`1f8fab36361aa8e473ffe6c411c8598a916a6d3f`](https://github.com/medusajs/medusa/commit/1f8fab36361aa8e473ffe6c411c8598a916a6d3f), [`375c4a5ab1b2805ef2a3d792327c325fa11740a5`](https://github.com/medusajs/medusa/commit/375c4a5ab1b2805ef2a3d792327c325fa11740a5), [`13e159d8ad7ebb3e6977969b4bb10877d7bb7850`](https://github.com/medusajs/medusa/commit/13e159d8ad7ebb3e6977969b4bb10877d7bb7850), [`2f7eb0ee030966844b45dd00b2259e68b9fb0e83`](https://github.com/medusajs/medusa/commit/2f7eb0ee030966844b45dd00b2259e68b9fb0e83), [`92c7baa56193e052c6af41ea240b8d2cecd9fb77`](https://github.com/medusajs/medusa/commit/92c7baa56193e052c6af41ea240b8d2cecd9fb77), [`31abba8cdeedee65328e5529e172d4d3b23661f3`](https://github.com/medusajs/medusa/commit/31abba8cdeedee65328e5529e172d4d3b23661f3), [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234), [`c870a7a1baf7db748a831265f06dd4b7378b262e`](https://github.com/medusajs/medusa/commit/c870a7a1baf7db748a831265f06dd4b7378b262e), [`9ac74eead4760d6c92676d451e6f25c2305b1852`](https://github.com/medusajs/medusa/commit/9ac74eead4760d6c92676d451e6f25c2305b1852)]:
  - @medusajs/types@2.7.0
  - @medusajs/utils@2.7.0
  - @medusajs/orchestration@2.7.0
  - @medusajs/modules-sdk@2.7.0

## 2.6.1

### Patch Changes

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- [#11756](https://github.com/medusajs/medusa/pull/11756) [`84f991192ec288f90af36c5352448b2785901d1a`](https://github.com/medusajs/medusa/commit/84f991192ec288f90af36c5352448b2785901d1a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Allow when then in parallelize

- Updated dependencies [[`b7678983a9b3e5c4d88282054b37b6c517329bd7`](https://github.com/medusajs/medusa/commit/b7678983a9b3e5c4d88282054b37b6c517329bd7), [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861)]:
  - @medusajs/types@2.6.1
  - @medusajs/orchestration@2.6.1
  - @medusajs/modules-sdk@2.6.1
  - @medusajs/utils@2.6.1

## 2.6.0

### Patch Changes

- [#11641](https://github.com/medusajs/medusa/pull/11641) [`c250de79192bda1b1cd217bcca37f458c693de1d`](https://github.com/medusajs/medusa/commit/c250de79192bda1b1cd217bcca37f458c693de1d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Prevent sub workflow events release early + redis unlink

- Updated dependencies [[`8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125`](https://github.com/medusajs/medusa/commit/8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125), [`698a520729a3045cd13eed5ee0e5120a563e9261`](https://github.com/medusajs/medusa/commit/698a520729a3045cd13eed5ee0e5120a563e9261), [`51b0af193c7dde4899a696a515b59373b465d907`](https://github.com/medusajs/medusa/commit/51b0af193c7dde4899a696a515b59373b465d907), [`eeebb35758ea443468dd2355a7ea761dfe24babc`](https://github.com/medusajs/medusa/commit/eeebb35758ea443468dd2355a7ea761dfe24babc), [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9), [`d1efad9bf05ca80959e8b50d74b74167fc1b0064`](https://github.com/medusajs/medusa/commit/d1efad9bf05ca80959e8b50d74b74167fc1b0064), [`ca6a15717d05de112ca00ca56d65beb2ab0f2598`](https://github.com/medusajs/medusa/commit/ca6a15717d05de112ca00ca56d65beb2ab0f2598), [`d814d9540e76256be23d733b73cf5a63aa380c8b`](https://github.com/medusajs/medusa/commit/d814d9540e76256be23d733b73cf5a63aa380c8b), [`d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30`](https://github.com/medusajs/medusa/commit/d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30), [`b42f151be31161a5d7a73132ee6794b990403d76`](https://github.com/medusajs/medusa/commit/b42f151be31161a5d7a73132ee6794b990403d76), [`ab96ad3b8213b117b067ae0ab66b94f74b8bd031`](https://github.com/medusajs/medusa/commit/ab96ad3b8213b117b067ae0ab66b94f74b8bd031)]:
  - @medusajs/types@2.6.0
  - @medusajs/utils@2.6.0
  - @medusajs/modules-sdk@2.6.0
  - @medusajs/orchestration@2.6.0

## 2.5.1

### Patch Changes

- Updated dependencies [[`22276648ad0aef12206464b555efdce97e316bb4`](https://github.com/medusajs/medusa/commit/22276648ad0aef12206464b555efdce97e316bb4), [`d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71`](https://github.com/medusajs/medusa/commit/d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71), [`63f0774569643ffe473daef2fcfd8944954d72c0`](https://github.com/medusajs/medusa/commit/63f0774569643ffe473daef2fcfd8944954d72c0), [`1a3843a92a6db83b9249e9c0aece7b3d13a600a9`](https://github.com/medusajs/medusa/commit/1a3843a92a6db83b9249e9c0aece7b3d13a600a9), [`d6c03ee5427457237e3c739545a8816cc3a3198e`](https://github.com/medusajs/medusa/commit/d6c03ee5427457237e3c739545a8816cc3a3198e), [`3b4997840e624ef8da1a75744b4bfb5c5a371f7c`](https://github.com/medusajs/medusa/commit/3b4997840e624ef8da1a75744b4bfb5c5a371f7c), [`0c957350a6688c78572361b51c1f16a452a31aed`](https://github.com/medusajs/medusa/commit/0c957350a6688c78572361b51c1f16a452a31aed), [`448dbcb5963c732c9c3b822b81330556bcf883cd`](https://github.com/medusajs/medusa/commit/448dbcb5963c732c9c3b822b81330556bcf883cd), [`065df75e7d5b90a4de43873d8c08e1aab65e3fd7`](https://github.com/medusajs/medusa/commit/065df75e7d5b90a4de43873d8c08e1aab65e3fd7), [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b), [`32c5015f563b7d60221a472635b44820fe4ef1f6`](https://github.com/medusajs/medusa/commit/32c5015f563b7d60221a472635b44820fe4ef1f6)]:
  - @medusajs/orchestration@2.5.1
  - @medusajs/modules-sdk@2.5.1
  - @medusajs/types@2.5.1
  - @medusajs/utils@2.5.1

## 2.5.0

### Patch Changes

- Updated dependencies [[`6db96c80d05730a9188937599baba2602f4e2a92`](https://github.com/medusajs/medusa/commit/6db96c80d05730a9188937599baba2602f4e2a92), [`e98d3c615e8a42e09974ded9cc3ca3277e3a9217`](https://github.com/medusajs/medusa/commit/e98d3c615e8a42e09974ded9cc3ca3277e3a9217), [`9f1a3b2a4214ef23a22972e6d28c5f43f87da353`](https://github.com/medusajs/medusa/commit/9f1a3b2a4214ef23a22972e6d28c5f43f87da353), [`cb0f065c9dd59fe54a52c337f9b5392723f9db58`](https://github.com/medusajs/medusa/commit/cb0f065c9dd59fe54a52c337f9b5392723f9db58), [`016e332e9b98f316cded6eb999927fc942ce56c5`](https://github.com/medusajs/medusa/commit/016e332e9b98f316cded6eb999927fc942ce56c5), [`65fae943c9d919f658c8660e5b46626c1b302e31`](https://github.com/medusajs/medusa/commit/65fae943c9d919f658c8660e5b46626c1b302e31), [`a33aebd8957f4bab10afd5e50a810cf738879b0d`](https://github.com/medusajs/medusa/commit/a33aebd8957f4bab10afd5e50a810cf738879b0d), [`c9821171866a5a66ce5b7f0b8a414de48dbcdc7e`](https://github.com/medusajs/medusa/commit/c9821171866a5a66ce5b7f0b8a414de48dbcdc7e), [`244cd714b2e8dc742afbefd0d175649f8fc45eed`](https://github.com/medusajs/medusa/commit/244cd714b2e8dc742afbefd0d175649f8fc45eed), [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f), [`3c51709daf07dcdd5563fa08fec2446a42cc8058`](https://github.com/medusajs/medusa/commit/3c51709daf07dcdd5563fa08fec2446a42cc8058)]:
  - @medusajs/types@2.5.0
  - @medusajs/orchestration@2.5.0
  - @medusajs/utils@2.5.0
  - @medusajs/modules-sdk@2.5.0

## 2.4.0

### Minor Changes

- [#10292](https://github.com/medusajs/medusa/pull/10292) [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: upgrade to mikro-orm 6

### Patch Changes

- Updated dependencies [[`d4e042e9ad838cfc3b3c83c342afaf76adb281d2`](https://github.com/medusajs/medusa/commit/d4e042e9ad838cfc3b3c83c342afaf76adb281d2), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547), [`a76208ed0217e5a3993d48e1884e855966691fd8`](https://github.com/medusajs/medusa/commit/a76208ed0217e5a3993d48e1884e855966691fd8), [`ecc8efcb049f5c77cb7e38c2b6a273860590a5f4`](https://github.com/medusajs/medusa/commit/ecc8efcb049f5c77cb7e38c2b6a273860590a5f4), [`da3906efa42ee729c11696e2d3255a60ac3fa958`](https://github.com/medusajs/medusa/commit/da3906efa42ee729c11696e2d3255a60ac3fa958)]:
  - @medusajs/types@2.4.0
  - @medusajs/orchestration@2.4.0
  - @medusajs/modules-sdk@2.4.0
  - @medusajs/utils@2.4.0

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@2.3.1
  - @medusajs/orchestration@2.3.1
  - @medusajs/types@2.3.1
  - @medusajs/utils@2.3.1

## 2.3.0

### Patch Changes

- Updated dependencies [[`67782350a9da278457c3280c300ebec65bdc6326`](https://github.com/medusajs/medusa/commit/67782350a9da278457c3280c300ebec65bdc6326), [`ff725090bb4ec848cb82c5411bdc25c4b72252ab`](https://github.com/medusajs/medusa/commit/ff725090bb4ec848cb82c5411bdc25c4b72252ab), [`01acf9e7009300c01544f022c2a97d4d3f0fdb65`](https://github.com/medusajs/medusa/commit/01acf9e7009300c01544f022c2a97d4d3f0fdb65), [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd), [`c75678d6d41d3b88d07681ad7e24472d6cbde672`](https://github.com/medusajs/medusa/commit/c75678d6d41d3b88d07681ad7e24472d6cbde672), [`c1930bd6568043d145e34d8360015e7207e18e4a`](https://github.com/medusajs/medusa/commit/c1930bd6568043d145e34d8360015e7207e18e4a), [`28febfc6438351fddb5b214b86f96aff89db688e`](https://github.com/medusajs/medusa/commit/28febfc6438351fddb5b214b86f96aff89db688e), [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c)]:
  - @medusajs/utils@2.3.0
  - @medusajs/types@2.3.0
  - @medusajs/orchestration@2.3.0
  - @medusajs/modules-sdk@2.3.0

## 2.2.0

### Patch Changes

- [#10674](https://github.com/medusajs/medusa/pull/10674) [`7d8f6cf39f96638ad90b4926cf20187aacf788fc`](https://github.com/medusajs/medusa/commit/7d8f6cf39f96638ad90b4926cf20187aacf788fc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Workflow cancellation + gracefully handle non serializable state

- Updated dependencies [[`ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81`](https://github.com/medusajs/medusa/commit/ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81), [`7d8f6cf39f96638ad90b4926cf20187aacf788fc`](https://github.com/medusajs/medusa/commit/7d8f6cf39f96638ad90b4926cf20187aacf788fc), [`13ddf27c68fc2831b3661940bc5f27bab23ce8c0`](https://github.com/medusajs/medusa/commit/13ddf27c68fc2831b3661940bc5f27bab23ce8c0), [`99a06102a246c119f69d1873f3cdeee9ff1241a0`](https://github.com/medusajs/medusa/commit/99a06102a246c119f69d1873f3cdeee9ff1241a0), [`4f897661eb7a855a881d460c565c2da6459367eb`](https://github.com/medusajs/medusa/commit/4f897661eb7a855a881d460c565c2da6459367eb), [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0), [`5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5`](https://github.com/medusajs/medusa/commit/5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5), [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374), [`0559d54c18d2e79c78c2b9a348b9873d1a786dea`](https://github.com/medusajs/medusa/commit/0559d54c18d2e79c78c2b9a348b9873d1a786dea)]:
  - @medusajs/modules-sdk@2.2.0
  - @medusajs/types@2.2.0
  - @medusajs/utils@2.2.0
  - @medusajs/orchestration@2.2.0

## 2.1.3

### Patch Changes

- Updated dependencies [[`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3), [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815), [`2ad08c4c440706dd2ffe2215807b89ee4a7f325b`](https://github.com/medusajs/medusa/commit/2ad08c4c440706dd2ffe2215807b89ee4a7f325b), [`048620884b5d458b109ac496e7a2056c202bd459`](https://github.com/medusajs/medusa/commit/048620884b5d458b109ac496e7a2056c202bd459)]:
  - @medusajs/types@2.1.3
  - @medusajs/utils@2.1.3
  - @medusajs/modules-sdk@2.1.3
  - @medusajs/orchestration@2.1.3

## 2.1.2

### Patch Changes

- Updated dependencies [[`729eb5da7b6daf9781b8bdcbc2fab344e942d444`](https://github.com/medusajs/medusa/commit/729eb5da7b6daf9781b8bdcbc2fab344e942d444), [`16d27ea6e4c2e4290820fe2328f08557534fcb8f`](https://github.com/medusajs/medusa/commit/16d27ea6e4c2e4290820fe2328f08557534fcb8f), [`fad85a9d293acee1dae784afa223a080b9b8b85b`](https://github.com/medusajs/medusa/commit/fad85a9d293acee1dae784afa223a080b9b8b85b), [`885c82ded63e504739bf39a113f820c87c9e2d52`](https://github.com/medusajs/medusa/commit/885c82ded63e504739bf39a113f820c87c9e2d52), [`90ad2566fdde2215447100d10c3fe9b17ce826b5`](https://github.com/medusajs/medusa/commit/90ad2566fdde2215447100d10c3fe9b17ce826b5), [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10)]:
  - @medusajs/types@2.1.2
  - @medusajs/utils@2.1.2
  - @medusajs/modules-sdk@2.1.2
  - @medusajs/orchestration@2.1.2

## 2.1.1

### Patch Changes

- [#10459](https://github.com/medusajs/medusa/pull/10459) [`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix: when/then step name

- Updated dependencies [[`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b), [`0a077d48e14976bafcf19705fc48e66756362fd6`](https://github.com/medusajs/medusa/commit/0a077d48e14976bafcf19705fc48e66756362fd6), [`a1a1e0e789424546443ce195b95f652d081d7b3b`](https://github.com/medusajs/medusa/commit/a1a1e0e789424546443ce195b95f652d081d7b3b), [`16663ec8132e99bac7fbfe2adda542a5294d2384`](https://github.com/medusajs/medusa/commit/16663ec8132e99bac7fbfe2adda542a5294d2384), [`90d7f4ff3949ade9f6a7335c9611aae6633be908`](https://github.com/medusajs/medusa/commit/90d7f4ff3949ade9f6a7335c9611aae6633be908), [`f65a3cc06df9faca3615f30eb4d3bf889efa5765`](https://github.com/medusajs/medusa/commit/f65a3cc06df9faca3615f30eb4d3bf889efa5765), [`b160fd3cbf6edf06702fa15b694709375557d188`](https://github.com/medusajs/medusa/commit/b160fd3cbf6edf06702fa15b694709375557d188), [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a), [`0a16efa4266f93302b31589349e777bc8d24dc07`](https://github.com/medusajs/medusa/commit/0a16efa4266f93302b31589349e777bc8d24dc07), [`864f53011b892e1ed0abee2e241b662eccef7e6d`](https://github.com/medusajs/medusa/commit/864f53011b892e1ed0abee2e241b662eccef7e6d), [`69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1`](https://github.com/medusajs/medusa/commit/69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1)]:
  - @medusajs/utils@2.1.1
  - @medusajs/types@2.1.1
  - @medusajs/modules-sdk@2.1.1
  - @medusajs/orchestration@2.1.1

## 2.1.0

### Patch Changes

- Updated dependencies [[`194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7`](https://github.com/medusajs/medusa/commit/194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7), [`3e98364bd1631f96846cd3199bf7497702cf5923`](https://github.com/medusajs/medusa/commit/3e98364bd1631f96846cd3199bf7497702cf5923), [`324b4ab438662f44de495ffe4d9137677a032a00`](https://github.com/medusajs/medusa/commit/324b4ab438662f44de495ffe4d9137677a032a00)]:
  - @medusajs/utils@2.1.0
  - @medusajs/types@2.1.0
  - @medusajs/modules-sdk@2.1.0
  - @medusajs/orchestration@2.1.0

## 2.0.7

### Patch Changes

- Updated dependencies [[`e9003c3124f284eae7e1457101bf10c1beccbac1`](https://github.com/medusajs/medusa/commit/e9003c3124f284eae7e1457101bf10c1beccbac1)]:
  - @medusajs/utils@2.0.7
  - @medusajs/modules-sdk@2.0.7
  - @medusajs/orchestration@2.0.7
  - @medusajs/types@2.0.7

## 2.0.6

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@2.0.6
  - @medusajs/orchestration@2.0.6
  - @medusajs/types@2.0.6
  - @medusajs/utils@2.0.6

## 2.0.5

### Patch Changes

- [#10177](https://github.com/medusajs/medusa/pull/10177) [`aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e`](https://github.com/medusajs/medusa/commit/aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Add response to permanent failure

- [#10031](https://github.com/medusajs/medusa/pull/10031) [`1eef324af33cfb70b414ac564788f28dfd6d2c18`](https://github.com/medusajs/medusa/commit/1eef324af33cfb70b414ac564788f28dfd6d2c18) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix set step failure for async steps

- Updated dependencies [[`aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e`](https://github.com/medusajs/medusa/commit/aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e), [`9dff05cddeeca40fab47760fa15e07ca087664ed`](https://github.com/medusajs/medusa/commit/9dff05cddeeca40fab47760fa15e07ca087664ed), [`1659c9be5d3ace1bed9f3a6e7206fe54e60645c0`](https://github.com/medusajs/medusa/commit/1659c9be5d3ace1bed9f3a6e7206fe54e60645c0), [`42c08fa8e00d33e93e152b3058d2f73476b9a0c3`](https://github.com/medusajs/medusa/commit/42c08fa8e00d33e93e152b3058d2f73476b9a0c3), [`3e265229f2ae5c3d55f64a445574c13c40b52c14`](https://github.com/medusajs/medusa/commit/3e265229f2ae5c3d55f64a445574c13c40b52c14), [`1eef324af33cfb70b414ac564788f28dfd6d2c18`](https://github.com/medusajs/medusa/commit/1eef324af33cfb70b414ac564788f28dfd6d2c18), [`3fee17747f059a331e9fbe40622205b968404faf`](https://github.com/medusajs/medusa/commit/3fee17747f059a331e9fbe40622205b968404faf), [`7390c14c20f7b5053458de1b1a58870dc8e441cc`](https://github.com/medusajs/medusa/commit/7390c14c20f7b5053458de1b1a58870dc8e441cc)]:
  - @medusajs/orchestration@2.0.5
  - @medusajs/types@2.0.5
  - @medusajs/utils@2.0.5
  - @medusajs/modules-sdk@2.0.5

## 2.0.4

### Patch Changes

- Updated dependencies [[`34f4f695c0b8359a6e9efd45fd081ea743a1c439`](https://github.com/medusajs/medusa/commit/34f4f695c0b8359a6e9efd45fd081ea743a1c439), [`bc2d556c2c57adab637308fb65247b17b8cd2ed5`](https://github.com/medusajs/medusa/commit/bc2d556c2c57adab637308fb65247b17b8cd2ed5)]:
  - @medusajs/types@2.0.4
  - @medusajs/modules-sdk@2.0.4
  - @medusajs/orchestration@2.0.4
  - @medusajs/utils@2.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`03f4b66b90625634f13409be35cd57081f0eb7d5`](https://github.com/medusajs/medusa/commit/03f4b66b90625634f13409be35cd57081f0eb7d5)]:
  - @medusajs/types@2.0.3
  - @medusajs/utils@2.0.3
  - @medusajs/modules-sdk@2.0.3
  - @medusajs/orchestration@2.0.3

## 2.0.2

### Patch Changes

- [#9921](https://github.com/medusajs/medusa/pull/9921) [`c0368cca282fe26c9e557240bb8ca90514da70c6`](https://github.com/medusajs/medusa/commit/c0368cca282fe26c9e557240bb8ca90514da70c6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflows-sdk): Paralellize steps rollback issue with config

- Updated dependencies [[`bbf4af17258ea34adeeb8ff3a6cd213a12d67c76`](https://github.com/medusajs/medusa/commit/bbf4af17258ea34adeeb8ff3a6cd213a12d67c76), [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f), [`16b4cc433e996d1a54e4ff043daaa148981ba63d`](https://github.com/medusajs/medusa/commit/16b4cc433e996d1a54e4ff043daaa148981ba63d), [`879ce33090c7e99ae8b466c31c5dc0c67cdbc08f`](https://github.com/medusajs/medusa/commit/879ce33090c7e99ae8b466c31c5dc0c67cdbc08f), [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd)]:
  - @medusajs/types@2.0.2
  - @medusajs/utils@2.0.2
  - @medusajs/modules-sdk@2.0.2
  - @medusajs/orchestration@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@2.0.1
  - @medusajs/orchestration@2.0.1
  - @medusajs/types@2.0.1
  - @medusajs/utils@2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/modules-sdk@2.0.0
  - @medusajs/orchestration@2.0.0
  - @medusajs/types@2.0.0
  - @medusajs/utils@2.0.0

## 0.1.6

### Patch Changes

- [#6869](https://github.com/medusajs/medusa/pull/6869) [`e603726985`](https://github.com/medusajs/medusa/commit/e60372698565315145037eb40fbe86c43f91cc16) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix Workflow Engine subscribers response and error

- [#6886](https://github.com/medusajs/medusa/pull/6886) [`a164c0d512`](https://github.com/medusajs/medusa/commit/a164c0d5126a40e2bc669f9fc2883be502a15036) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Async steps marked as success if return StepResponse

- [#6860](https://github.com/medusajs/medusa/pull/6860) [`45c49e89f2`](https://github.com/medusajs/medusa/commit/45c49e89f28123ef622fc1c07253bae94fd74875) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Add workflow idempotencyKey to shared context

- [#6951](https://github.com/medusajs/medusa/pull/6951) [`71aeda7347`](https://github.com/medusajs/medusa/commit/71aeda7347a1dc7039be05071ce90a6dca5f9154) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflows-sdk): Handle result from a trasnformer after a step fail

- Updated dependencies [[`e603726985`](https://github.com/medusajs/medusa/commit/e60372698565315145037eb40fbe86c43f91cc16), [`d333db0842`](https://github.com/medusajs/medusa/commit/d333db08429611c0571a0b173adf37103b8a8aa6), [`1eeb1e9de3`](https://github.com/medusajs/medusa/commit/1eeb1e9de3e0b571735437b00968ee96e4aabad5), [`20e8df914e`](https://github.com/medusajs/medusa/commit/20e8df914ec5fdf8d562d4fa84f72c58c7056195), [`a164c0d512`](https://github.com/medusajs/medusa/commit/a164c0d5126a40e2bc669f9fc2883be502a15036), [`e0b02a1012`](https://github.com/medusajs/medusa/commit/e0b02a1012981c29830d7779f59ebe805bbfd137), [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c), [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509), [`dd35a4dbff`](https://github.com/medusajs/medusa/commit/dd35a4dbff10c86ea3c5f7f817c18b6e60d599e3), [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c), [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465), [`5d9aea053c`](https://github.com/medusajs/medusa/commit/5d9aea053ce6e04f242f86fb9053c13dec515d5b), [`232322d035`](https://github.com/medusajs/medusa/commit/232322d03515f81e56867ff8c765b8409399ee68), [`528ef4ca90`](https://github.com/medusajs/medusa/commit/528ef4ca90bb2cf6173dccc9fd6a9f9932ff9b76), [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e), [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1), [`3affcc2525`](https://github.com/medusajs/medusa/commit/3affcc252599c93cf52fef24ec4f3695d65db79a), [`667c8609cc`](https://github.com/medusajs/medusa/commit/667c8609ccf3850f5df8cf784723a95bd0d6d2a6), [`edcafa140c`](https://github.com/medusajs/medusa/commit/edcafa140c1869df3c420c2becfbf23b6af75ddc), [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5), [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9), [`1c6ba4468e`](https://github.com/medusajs/medusa/commit/1c6ba4468eab1440931c88929affd5b4c593f377)]:
  - @medusajs/orchestration@0.5.7
  - @medusajs/modules-sdk@1.12.11
  - @medusajs/utils@1.11.9

## 0.1.5

### Patch Changes

- [#6778](https://github.com/medusajs/medusa/pull/6778) [`7e93eda1a4`](https://github.com/medusajs/medusa/commit/7e93eda1a44310311d2f3f8a1d634f60e7c48cb5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Feat: workflow cancel

- [#6760](https://github.com/medusajs/medusa/pull/6760) [`3ca957ec0f`](https://github.com/medusajs/medusa/commit/3ca957ec0fdcdc966a3d2ca94b8222d68767cf9a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Added idempotencyKey to workflow step context

- Updated dependencies [[`06f22bb48a`](https://github.com/medusajs/medusa/commit/06f22bb48ad1fe73577657b8c5db055312f16a0d), [`7e93eda1a4`](https://github.com/medusajs/medusa/commit/7e93eda1a44310311d2f3f8a1d634f60e7c48cb5), [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c), [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1), [`4974f5e455`](https://github.com/medusajs/medusa/commit/4974f5e4557bd64a328a881ec02b91e15485bd23), [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62)]:
  - @medusajs/modules-sdk@1.12.10
  - @medusajs/orchestration@0.5.6
  - @medusajs/utils@1.11.8

## 0.1.4

### Patch Changes

- [#6474](https://github.com/medusajs/medusa/pull/6474) [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018) Thanks [@riqwan](https://github.com/riqwan)! - feat(workflows-sdk,core-flows,medusa,types): add workflow to add promotions to cart

- [#6330](https://github.com/medusajs/medusa/pull/6330) [`0c2a460751`](https://github.com/medusajs/medusa/commit/0c2a460751644021056d0f99d9b1fffe509fb7ab) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflow engine API

- [#6726](https://github.com/medusajs/medusa/pull/6726) [`4b06c17dc0`](https://github.com/medusajs/medusa/commit/4b06c17dc00dc9ed50898573aee704b84dd181b3) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflows-sdk): Value resolver should resolve non StepResponse

- [#6468](https://github.com/medusajs/medusa/pull/6468) [`f611865553`](https://github.com/medusajs/medusa/commit/f611865553b1f6914bed58ef2eacdf5e929d60dc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflows=sdk): Fix StepFunction typings and custom step name

- [#6700](https://github.com/medusajs/medusa/pull/6700) [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Version all modules to allow for initial testing

- Updated dependencies [[`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`56cbf88115`](https://github.com/medusajs/medusa/commit/56cbf88115994adea7037c3f2814f0c96af3cfc0), [`36a61658f9`](https://github.com/medusajs/medusa/commit/36a61658f969a7b19c84a1e621ad1464927cafb1), [`25d176b851`](https://github.com/medusajs/medusa/commit/25d176b851c041ecc7901163b704b36b7e585076), [`c319edb8e0`](https://github.com/medusajs/medusa/commit/c319edb8e0ecd13d086652147667916e5abab2d8), [`0b9fcb6324`](https://github.com/medusajs/medusa/commit/0b9fcb6324eee9f2556c7e6317775fae93b12a47), [`586df9da25`](https://github.com/medusajs/medusa/commit/586df9da250e492442769f5bac2f8b3de1d46f05), [`b3d826497b`](https://github.com/medusajs/medusa/commit/b3d826497b3dae5e1b26b7924706c24fd5e87ca5), [`a86c87fe14`](https://github.com/medusajs/medusa/commit/a86c87fe1442afce9285e39255914e01012b4449), [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632), [`8ea37d03c9`](https://github.com/medusajs/medusa/commit/8ea37d03c914a5004a3e42770668b2d1f7f8f564), [`339a946f38`](https://github.com/medusajs/medusa/commit/339a946f389033c21e05338f9dbf07d88e140533), [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`8dad2b51a2`](https://github.com/medusajs/medusa/commit/8dad2b51a26c4c3c14a6c95f70424c8bef2ad63e), [`8a946beb75`](https://github.com/medusajs/medusa/commit/8a946beb75dd2560baffb5adc508969bf1fe8ef5), [`a6d7070dd6`](https://github.com/medusajs/medusa/commit/a6d7070dd669c21ea19d70434d42c2f8167dc309), [`168f02f138`](https://github.com/medusajs/medusa/commit/168f02f138ad101e1013f2c8c3f8dc19de12accf), [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62), [`000eb61e33`](https://github.com/medusajs/medusa/commit/000eb61e33e0302db95ee6ad1656ea9b430ed471), [`d550be3685`](https://github.com/medusajs/medusa/commit/d550be3685423218d47a20c57a5e06758f4a961a), [`62a7bcc30c`](https://github.com/medusajs/medusa/commit/62a7bcc30cbc7b234b2b51d7858439951a84edeb), [`a8794d48de`](https://github.com/medusajs/medusa/commit/a8794d48de11c4b31f7d8f0dd254caf17daf052e), [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8), [`6500f18b9b`](https://github.com/medusajs/medusa/commit/6500f18b9b80c5c9c473489e7e740d55dca74303), [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1), [`a6a4b3f01a`](https://github.com/medusajs/medusa/commit/a6a4b3f01a6d2bd97b1580c59134279a1b033a5d), [`4625bd1241`](https://github.com/medusajs/medusa/commit/4625bd12416275b09c22cde4a09cb0f68df5d7c1), [`56b0b45304`](https://github.com/medusajs/medusa/commit/56b0b4530401a6ec5aa155874d371e45bb388fe2), [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7), [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb), [`e85463b2a7`](https://github.com/medusajs/medusa/commit/e85463b2a717751de2e21c39a4c745449b31affe)]:
  - @medusajs/utils@1.11.7
  - @medusajs/orchestration@0.5.5
  - @medusajs/modules-sdk@1.12.9

## 0.1.3

### Patch Changes

- [#6263](https://github.com/medusajs/medusa/pull/6263) [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflows passing MedusaContext as argument

- Updated dependencies [[`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b), [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83), [`96ba49329`](https://github.com/medusajs/medusa/commit/96ba49329b6b05922c90f0c55f16455cb40aa5ca), [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9), [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428), [`882aa549b`](https://github.com/medusajs/medusa/commit/882aa549bdcc6f378934eab2a7c485df354f46aa)]:
  - @medusajs/utils@1.11.5
  - @medusajs/modules-sdk@1.12.8
  - @medusajs/orchestration@0.5.4

## 0.1.2

### Patch Changes

- [#6128](https://github.com/medusajs/medusa/pull/6128) [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Modules: Workflows Engine in-memory and Redis

- [#6164](https://github.com/medusajs/medusa/pull/6164) [`738e9115e`](https://github.com/medusajs/medusa/commit/738e9115ec920d48bc52b8a690847e58c87ca28e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): run, registerStepSuccess and registerStepFailure shortcut

- [#6102](https://github.com/medusajs/medusa/pull/6102) [`19bbae61f8`](https://github.com/medusajs/medusa/commit/19bbae61f8de1ac0ed574caff17b33e17705005a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - create workflow can return destructured properties of a step

- Updated dependencies [[`68ddd866a5`](https://github.com/medusajs/medusa/commit/68ddd866a5ff9414e2db5b80d75acc5e81948540), [`72bc52231c`](https://github.com/medusajs/medusa/commit/72bc52231ca3a72fa6d197a248fe07a938ed0d85), [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e), [`a9b4214503`](https://github.com/medusajs/medusa/commit/a9b42145032ee88aa922a11fe03e777b140c68f4), [`d85fee42e`](https://github.com/medusajs/medusa/commit/d85fee42ee7f661310584dfee5741d6c53b989bb), [`5e655dd59`](https://github.com/medusajs/medusa/commit/5e655dd59bda4ffface28db38021ba71cae6de10), [`b782d3bcb7`](https://github.com/medusajs/medusa/commit/b782d3bcb7e8088a962584b9a55200dd29c2161c), [`2b9f98895e`](https://github.com/medusajs/medusa/commit/2b9f98895eaca255e01278674b11cd7cb69b388f), [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de), [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4), [`daecd82a7`](https://github.com/medusajs/medusa/commit/daecd82a7cdf7315599f464999690414c20d6748), [`06b33a9b4`](https://github.com/medusajs/medusa/commit/06b33a9b4525b77b1b14b35b973209700945654e), [`b6ac768698`](https://github.com/medusajs/medusa/commit/b6ac768698a3b49d0162cb49e628386f3352d034), [`130c641e5c`](https://github.com/medusajs/medusa/commit/130c641e5c91cf831de64fb87aebbfdc4d23530d), [`fade8ea7bf`](https://github.com/medusajs/medusa/commit/fade8ea7bf560343ecbde116d226ac44053cdb8e), [`8472460f53`](https://github.com/medusajs/medusa/commit/8472460f533322cc4535199aa768ac163021bc79)]:
  - @medusajs/utils@1.11.4
  - @medusajs/modules-sdk@1.12.7
  - @medusajs/orchestration@0.5.3

## 0.1.1

### Patch Changes

- [#5728](https://github.com/medusajs/medusa/pull/5728) [`9cc787cac4`](https://github.com/medusajs/medusa/commit/9cc787cac4bf1c5d8edf1c4b548bb3205100e822) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Configurable retries upon step creation

- [#5951](https://github.com/medusajs/medusa/pull/5951) [`bf63c4e6a`](https://github.com/medusajs/medusa/commit/bf63c4e6a32258565e1d361b8919afbf93cc2c72) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(orchestration, workflows-sdk): Add events management and implementation to manage async workflows

- [#5775](https://github.com/medusajs/medusa/pull/5775) [`8402f4697`](https://github.com/medusajs/medusa/commit/8402f46970c007bab9e0f1f6ae653d955650d503) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Allow a step to not define an expected input

- [#6020](https://github.com/medusajs/medusa/pull/6020) [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, orchestration, utils, workflows-sdk): add transaction options support and cleanup

- [#5953](https://github.com/medusajs/medusa/pull/5953) [`a0dd18c12`](https://github.com/medusajs/medusa/commit/a0dd18c12ac5ab6280366d93d7b47cdb3036914b) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Allow primitive values to be passed as well as WorkflowDataProperties

- Updated dependencies [[`6d1e3cc02`](https://github.com/medusajs/medusa/commit/6d1e3cc0285ef157fd6486060e8b32c00c01aa80), [`42cc8ae3f`](https://github.com/medusajs/medusa/commit/42cc8ae3f89ed7d642e51654d1a3cca011f13155), [`45996d58a2`](https://github.com/medusajs/medusa/commit/45996d58a2665d72335faad11bea958f8da74195), [`9cc787cac4`](https://github.com/medusajs/medusa/commit/9cc787cac4bf1c5d8edf1c4b548bb3205100e822), [`bf63c4e6a`](https://github.com/medusajs/medusa/commit/bf63c4e6a32258565e1d361b8919afbf93cc2c72), [`355075097`](https://github.com/medusajs/medusa/commit/3550750975a0c9359fd887929377733606ef03af), [`925feea04`](https://github.com/medusajs/medusa/commit/925feea04a8222285175c33577548e50516069a7), [`3f6d79961`](https://github.com/medusajs/medusa/commit/3f6d79961dec1c5eb8950f8eacd94a5d87a4acde), [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285), [`c41f3002f`](https://github.com/medusajs/medusa/commit/c41f3002f3118b1f195c5c822fe0f400091d115b), [`d16d10619`](https://github.com/medusajs/medusa/commit/d16d10619dfbd3966a4709753de3d8cc37c6f2eb), [`890e76a5c`](https://github.com/medusajs/medusa/commit/890e76a5c53039576c42ca4d46af6f6977cdebd1), [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68), [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3)]:
  - @medusajs/modules-sdk@1.12.6
  - @medusajs/utils@1.11.3
  - @medusajs/orchestration@0.5.2

## 0.1.0

### Minor Changes

- [#5607](https://github.com/medusajs/medusa/pull/5607) [`9f9db3969`](https://github.com/medusajs/medusa/commit/9f9db396987776039ad0c2b8d5792d0ebdbf8792) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflows composer api

### Patch Changes

- [#5685](https://github.com/medusajs/medusa/pull/5685) [`1e39a95f8`](https://github.com/medusajs/medusa/commit/1e39a95f8a136427d04ea20cd320337af0923e31) Thanks [@riqwan](https://github.com/riqwan)! - fix(workflows, pricing, medusa): update region variants fix + pricing module migration scripts

- [#5668](https://github.com/medusajs/medusa/pull/5668) [`a39ce125c`](https://github.com/medusajs/medusa/commit/a39ce125cc96f14732d5a6301313d2376484fa23) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(workflows, product, types): Fix issues relating to update-variant workflow and options

- [#5705](https://github.com/medusajs/medusa/pull/5705) [`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(workflows, core-flows, ...): Split workflows tooling and definitions

- [#5714](https://github.com/medusajs/medusa/pull/5714) [`ffb0c7b4c`](https://github.com/medusajs/medusa/commit/ffb0c7b4cdbc83b61f70c881001a69de6ec8ae99) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Expose getName method to the workflow

- [#5691](https://github.com/medusajs/medusa/pull/5691) [`010560fd2`](https://github.com/medusajs/medusa/commit/010560fd2a4c12eb7a551919df33e58e7cbe920f) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix(workflows): compensation handling

- [#5536](https://github.com/medusajs/medusa/pull/5536) [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,types,workflows,utils,product,pricing): PricingModule Integration of PriceLists into Core

- Updated dependencies [[`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37), [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845), [`de8f74867`](https://github.com/medusajs/medusa/commit/de8f748674bfd19b3dbadb9695d9080aa91940de), [`9f9db3969`](https://github.com/medusajs/medusa/commit/9f9db396987776039ad0c2b8d5792d0ebdbf8792), [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4)]:
  - @medusajs/orchestration@0.5.0
  - @medusajs/utils@1.11.1
  - @medusajs/modules-sdk@1.12.4
