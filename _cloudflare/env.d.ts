/// <reference types="../worker-configuration.d.ts" />

interface Env {
  BOOPS_KV: KVNamespace
  GALLERY_R2: R2Bucket
}

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}

export {}
