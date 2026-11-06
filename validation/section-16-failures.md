# Source validation failures

## lint

```text

./src/app/(shop)/admin/page.tsx
2:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
2:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/cart/page.tsx
18:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
18:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/category/not-found.tsx
4:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
4:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/category/[id]/page.tsx
16:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
16:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/checkout/address/page.tsx
5:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
5:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/checkout/page.tsx
15:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
15:16  Error: Component definition is missing display name  react/display-name
110:36  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
110:50  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities

./src/app/(shop)/empty/page.tsx
4:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
4:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/orders/page.tsx
7:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
7:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/orders/[id]/page.tsx
24:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
24:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/product/not-found.tsx
4:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
4:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/product/[slug]/page.tsx
15:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
15:16  Error: Component definition is missing display name  react/display-name

./src/app/(shop)/products/page.tsx
2:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
2:16  Error: Component definition is missing display name  react/display-name

./src/app/auth/login/page.tsx
4:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
4:16  Error: Component definition is missing display name  react/display-name

./src/app/auth/new-account/page.tsx
4:1  Warning: Unexpected default export of anonymous function  import/no-anonymous-default-export
4:16  Error: Component definition is missing display name  react/display-name

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules

```
