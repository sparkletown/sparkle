<H1> Folder structure(Pages, Components, Templates, Organisms, Molecules, Atoms) </H1>
We should stick to one way of organizing our folder and component's structure.
Utils have files with .tsx file extension, which I think is inappropriate.
We have validation.js and wdyr.js files at the top level of src

<H1> Styles </H1>
Currently we both use Styled-Components and scss across our codebase. I think we should stick to one and remove the other

---

Mike's comment: _Personally, I prefer styled-components because they allow you to pass variables to your styles from the component_

<H1> Data fetching & selectors in components </H1>
We have a lot of ambiguity about how we interact with data in our app.
For example:

- `useConnects` in components with different ways of solving the issue, when there is no needed data(like a venue id)
- firestore direct pushes in `actions` and components

<H1> Merging flow </H1>
We should have a well-defined merging flow to avoid misunderstandings.

---

Mike's comment:

Depending on the CI\CD strategy we choose, we could end up with 2 flows(normal | hotfix).

- Normal: feat|impr|fix branch => Staging => Production
- Hotfix: hotfix branch => Prod && hotfix branch => Staging

<H1> Branch and commit naming </H1>
Well-defined rules for this can help keep everything tidy and understandable by all parties

---

Mike's comment:

I suggest having only 4 allowed terms in commits, branches, PR names:

- Improvement | IMPR - Refactoring
- Fix | FIX - bug fix
- Hotfix | HOTFIX - Direct bugfix to production(hopefully, the rarest one)
- Feature | FEAT - New feature / Behavior change of an old feature

Example:

- _[GITHUB_BOARD_TICKET_NUMBER]/['feat' | 'fix' | 'impr' | 'hotfix']/[short branch description] as an example of branch naming. Should be solidified as a regexp rule_
- _[GITHUB_BOARD_TICKET_NUMBER]: [Commit extensive description in present simple] - commit naming example. Should be solidified as a regexp rule_

<H1> Merging vs rebasing </H1>

---

Mike's comment: _I vote for rebasing as it helps in keeping the history clean. Also, one should rebase his branch with staging every day to avoid having lots of conflicts. After we discuss this one, I could write the perfect flow of working on a feature(As I see it)_

<H1> Casing for different types of files(Service, Component, Util functions, Styles, Types) </H1>
We have different casings for the same file types. For example:

- types/utility
- types/forms
- types/Role
- types/Question

<H1> Not related \ unused files and folders should be removed </H1>

Mike's comment: _I don't think `reporting` is needed in our codebase_

---

<H3> Replace js with ts. At least `src` folder should not contain js files </H3>

---

<H3> Proper loading and error logic across the app. Preferably happening somewhere in a data layer, so that you don't manage it in every component </H3>

---

<H1> With all the modals and other UI modules, we should think of the most efficient way of how to design them. Maybe we should store their in redux? </H1>

<H1>Assets (Icons, Images, default avatars...) </H1>
There are images all accross the project. Some of them are in component directories, others are in public folder. We should unify them and keep it simple in one place easy to add / remove. Also we should clean up the unnecessary ones.

<H1>Component structure</H1>
I think we should have a component structure and convention. Ex:

- _variables_
- _hooks_
- _functions_
- _render / return_

render structure: Ex:

- _renderMethod()_ or `<MiniComponent />`

---

Mike's comment: _I vote for using `MiniComponent` approach as it is easier to read and understand components when they are small and decoupled._
