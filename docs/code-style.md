# Code Style

---

**NOTE**:

Most of the information in this document is meant to help keep the code looking
similar and predictable while being worked on by different people. It isn't
meant to be rigid and static, but a suggestion. Thus, rule of thumb:

1. use your own best judgement;
2. try to follow style of code already in place;
3. notify others of issues and possible improvements.

---

## Comments (general)

There usually isn't a formal way of writing comments. Most common are simple
line comments, not block ones. However, a few tags, due to familiarity with JSDoc,
can be found outside these `/** */` blocks:

- `@debt` is usually some future issue or pull request to repay with better code
  solution be it refactor or replacement;
- `@deprecated` is usually a comment that gives an explanation and alternative;
- `@see` is usually followed by URL or similar reference for further info.

## Style Sheets (coding/design)

Over the course of the codebase there has been a revolving door of different
(S)CSS and CSS-in-JS systems. This is an attempt to give a general overview of
how they (can) coexist.

### Previous Different systems

There has been a mix of different style systems in use in the past. Some
include:

- _Styled Components_
- SCSS provided by _Create React App_ (_CRA_), not including modules
- _Bootstrap_ styles
- global overrides for the most basic HTML tags

### Naming

The naming of classes followed BEM (more at
https://en.bem.info/methodology/quick-start).

With a minor adjustment of using the `PascalCase` for the top level B(lock) to
agree with the name of the component.

### SCSS specific functionalities

Most of them could be found at `./src/scss`. More specifically the `colors.scss`
and `constants.scss` files.

Use of `@import` is deprecated by SCSS standard while encouraging replacement
with `@use`. The latter provides for better encapsulation and namespacing.

### SCSS modules + Tailwind parity

In order to make code style more uniform while using two different systems, here
are some naming conventions that can be used:

- import `classnames` library as `cn` for brevity since it will be used
  extensively;
- import Tailwind class strings from another file with `import * as TW from`;
- import SCSS module class maps as `import CN from`;
- use camelCasing for the constants: `TW.cancelButton`, `CN.nameInput`.

Prefer a single object notation if `classnames` result is stored in a variable:

```tsx
const buttonClasses = cn({
  [TW.buttonEnabled]: enabled,
  [TW.buttonDisabled]: !enabled,
});
```

But prefer a concatenation of string if `classnames` result is given directly to
the prop:

```tsx
<div className={cn("Component", CN.component)}></div>
```

## Injected class names vs. variance props

In the past, class names were being injected from parent components. Like this:

```tsx
<Component
  value={value}
  containerClassNames={`some-class-names-here ${containerClasses}`}
>
```

However, the above causes tight coupling of parent/child components as well as
unchecked possibility for minor differences that would cause every use of the
child component be slightly different and break uniformed UI/UX.

Some most basic components might still use `classNames` to inject classes and be
in sync with React's own naming. But this should be considered a rare exception
that deals with most generic components and as a workaround to a greater
problem. Example:

```tsx
<ButtonNG
  className="AdminRestricted__switch-button"
  variant="primary"
  loading={isLoggingOut}
  disabled={isLoggingOut}
  onClick={handleLogout}
>
```

The way to "inject" some classes but still keep the number of variations to the
minimum is a variance prop. Such example is the above `variant="primary"`, but
not limited.

Example: A component can have prop named

```tsx
width ? : "wide" | "narrow" | "normal"
```

and those strings be the names of exported constants in `Component.tailwind.ts`.
These classes can be accessed as `TW[width]` in a code like:

```tsx
const componentClasses = cn(className, TW.common, {
  [TW[variant]]: variant,
  [TW[width]]: width,
  [TW.disabled]: disabled,
  [TW.enabled]: !disabled,
  [TW.loading]: loading,
  [TW.notLoading]: !loading,
});
```

## TypeScript code (coding)

## Imports

Prefer shorthand (absolute) imports over relative ones. You can access every
directory under `. /src` with just typing its name. Example: instead of
`../../../../settings`, you can write`settings`.

##

Exports

Should try to not export types and interfaces that aren 't used elsewhere
outside that single file.There is a tool (`npm run prune`) that can generate a
list of all unused exports.This tool might be used alongside the linters that
execute before each commit.As for components, if they're only imported by a
sibling `index.ts` file, then there should be a check if that component is used
anywhere and if it's good to keep or delete it.

###

Types vs Interfaces

Usually types declared with `interface` were used to define a components
props. However, `type`s syntax allows for more robust definitions and should be
preferred in most cases and will allow for more uniformed looking code.

###

Enums

A simplistic explanation of TypeScript is it removes type information upon
compilation.The formal words used in the documentation is "type-level extension"
since most TS additions are type - level extensions to JS, and they don 't
affect the code' s runtime behavior.TypeScript 's solution in the enum case is
to break its own rule. When compiling it, extra JS code is emitted that never
existed in the original TS code.This adds a confusing complication to the
otherwise simple compiler model.For this reason, recommendation is to avoid
enums in favor of using unions.Example :

```ts
enum AllowedColor {
  red = "red",
  green = "green",
  blue = "blue",
}
```

would be

```ts
type AllowedColor = "red" | "green" | "blue";
```

For extensive range in values, branded types could be more useful.

### Naming

If the following practices aren't observed, there would be a tendency to have
different styles in the same file/component/etc. so a good rule of thumb is to
**try to follow the style of the code already in place**.

#### Functions

They should usually be named in camelCase style so the type can easily be the
same but in PascalCase:

- `const doNothing: DoNothing = () => undefined `

#### Constants

They are usually in the SCREAM_CASE, and that might be good enough to start
with:

- `THIS_IS_A_CONSTANT`
- `BUT.thisIsAPropertyOfTheConstant`

#### Suffixes

Good use of these suffixes will make it easier to determine what the identifier
is for by just looking at how the name ends:

- if it ends in `Props`, it's a React component props type;
- if it ends in `Options`, it's the single argument of a utility function;
- if it ends in `Result`, it is returned from a utility function;
- if it ends in `Context`, it's usually the argument of a listener/callback
  function
- but, `event` (or suffix `Event`) should be common for React event handlers.

Suffixes or names to avoid are `args`/`Args` and `params`/`Params` because the
terms themselves are usually too generic and also tend to add confusion as to
which of them refers to _formal argument/parameter_ and _actual
argument/parameter_.

### "Maybe could be useful later" dead code

Commenting out code just in case it might be reused later should be considered
bad practice. Such code usually remains invisible to tools (like the compiler)
and it will tend to drift apart from the related changes in other parts of the
code, thus by the time it may become useful, it will have to be refactored or
rewritten.

The safest way to deal with this situation is to:

1. outright delete the code (and maybe put into a branch), or
2. put it behind a disabling flag.

The former is self-explanatory: unused code is just taking up space. The latter
is achieved by adding a constant in `disableSettings.ts` prefixed as
`DISABLED_DUE_TO_` and used to switch off the execution of the ignored code
while preserving its visibility to the compiler, linter and other tools.

The file is also a good place to add a nice comment with the reason and maybe a
link or two.

### Extra conventions

Some files might have extra naming conventions put into place for a narrow use
case and should have them explained at or near the top of the file or at least
before the first use.

Example:

```ts
// in urlSettings.ts
// NOTE: URLs ending with _PARAM_URL aren't meant for direct browser consumption but React router
// NOTE: URLs ending with _ROOT_URL are the bases for sub-routers and URLs used inside them
// NOTE: URLs ending with _BASE_URL are the bases for other (often parametrized) URLs, but not at sub-router level
```

## Firebase (coding)

### Limited operators `in`, `not-in`, and `array-contains-any`

Because they're limited to combine up to 10 equality (`==`) clauses on the same
field with a logical `OR` operator it may cause an error to write a query like

```ts
where(["worldId", "in", worldIds]); // can be more than 10
```

while it is safe to write a query of the kind:

```ts
where(["type", "in", ["world", "space"]]); // is always 2
```

so the filtering should be done in the code (be it React or cloud function) in
the case of the former. You can read more at
https://firebase.google.com/docs/firestore/query-data/queries#in_not-in_and_array-contains-any

## Branching (coding/devops)

There is no strict rule about naming branches, aside the fact `staging` and
`master` are meaningful for CI/CD purposes. However, few best practices for
uniformed naming can be observed:

- prefix your branch with the type
  - `fix/branch-name` is OK
  - `my-branch-name` is usually not OK
  - rare exceptions can be major code changes like `redesign-2021`
- use dashed kebob case as it is the lowest common file system naming
  denominator
  - `this-is-ok` becaues it will work the same in all file systems
  - `This Might_BE problematic`
- if all prefixes are kept the same length, it makes it easier to visually
  inspect a long list of branch names, like:
  ```bash
  $ git worktree list
  /sparkletown/red          8b3907a3a [fix/venue-button]
  /sparkletown/green        45c3ce0f6 [fix/create-venue]
  /sparkletown/blue         783d46cec [env/burn-staging]
  /sparkletown/purple       724257f85 [rnd/style-lib]
  /sparkletown/brown        0232b4ef8 [new/code-style-docs]
  ```

## Pull Request Review

To make it easy for the reviewee to determine what kind if any action they
should take upon a comment, few tags at the beginning can be used:

- > [OOS] this is out of scope for the current PR, but we really need another PR
  > dealing with it
- > [NOTE] maybe something to be considered, maybe for later, not necessary to
  > act upon at this moment
- > [OPTIONAL] the code suggestion down is nice to have, but I'd approve without
  > it, especially if the PR is time sensitive

## Merge flow (devops)

Use `staging` as the base for your feature PRs. Once the code is merged, create
a deployment PR to `master` and from there it will automatically be deployed to
all the environments.
