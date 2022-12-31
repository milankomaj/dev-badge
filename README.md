# dev-badge

[![Badge v.2](https://dev-badge.eleonora.workers.dev?&style=flat&scale=3)](https://github.com/milankomaj/dev-badge)

> ##### live [example](https://milankomaj.github.io/site-dev-badge) preview     |    create your owns

---

> #### Build`s on Github.
> [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/milankomaj/dev-badge)

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': { 'fontSize': '18px'}}}%%
%%{ init: { 'flowchart': { 'curve': 'stepAfter' } } }%%
flowchart LR

A>Build`s on Github.] ==>|"#10067;"| B
X("secrets") .->B(("🟢"))
B(("🟢")) .->C("Deploy with Workers")
B(("🟢")) .->D("Fork repositori")
B(("🟢")) .->E("Use this template")
C & D & E -...->|"additional steps"| F("Run workflow") 

style F fill:#f6f8fa,stroke:#333,stroke-width:2px
style C fill:#404242,color:#fefefe
style D fill:#f6f8fa,stroke:#e9eaec
style E fill:#2da44e,stroke-width:0px,color:#ffffff
style F fill:#f6f8fa,stroke:#e9eaec
style A fill:#0969da,stroke:#333,stroke-width:2px,color:#fff,stroke-dasharray: 2 2

click A "https://github.com/milankomaj/dev-badge"
click D "https://github.com/milankomaj/dev-badge/fork"
click E "https://github.com/milankomaj/dev-badge/generate"


```

> [![Deploy](https://github.com/milankomaj/dev-badge/actions/workflows/deploy.yml/badge.svg)](https://github.com/milankomaj/dev-badge/actions/workflows/deploy.yml)

---

> #### Build localy.
> - [ ] Start[^note]
> - :one: clone/download [repository](https://github.com/milankomaj/dev-badge)
> - :two: ``` npm install  ```  or   ```  npm run NpmInstall  ``` 
> - :three: [development:](/package.json)
>   - ```  npm run dev  ``` 
>   - or ```  npm run local  ``` 
>   - or ```  npm run miniflare  ```      
>   - complete your secrets/keys in [*.dev.vars*](/.dev.vars) file  [^1]
>     - ```  localhost:8787  ``` 
> - :four: [production:](/package.json)
>   - ```  npm run pro  ``` 
>   - complete your secrets/keys in [*example.secrets.json*](/example.secrets.json) file  [^1]   
>     - ```  localhost:8787  ```
> - :five: [publish:](/package.json)
>   - ```  npm run deploy  ``` 
>   - or ```  wrangler publish  ```  
> - [x] Done

[^1]: some services/[*mods*](/mods) need secrets/keys :key:
[^note]:
    prerequisites: [*node*](https://nodejs.org), [*npm*](https://www.npmjs.com/), [*wrangler*](https://workers.cloudflare.com/)

 ---  
 > ##### related and similar projects: [*badgen*](https://github.com/badgen/badgen.net), [*webadge*](https://github.com/tuananh/webadge.dev), [*shields*](https://github.com/badges/shields)   

