<H1> Styles </H1>
Currently we both use Styled-Components and scss across our codebase.

Stick to BEM scss and remove and styled-components styles left
https://en.bem.info/methodology/quick-start/

<H2> Css variables </H2>
Use the variables to define
- font-size
- font-weight
- border-radius
- paddings/margins => spacing vars

<H1> Types vs Interfaces </H1>
Use interfaces to define the interface of the component/function. eg. the props/return.
All the other cases should be covered with `type`

<H1> Merging flow </H1>
Use staging as the base for your feature PRs.
Once the code is merged, create a deployment PR to master and from there it will automatically be deployed to all the envs

<H1> Prefer short-hand imports over relative </H1>
You can access every folder within src first-level ierarchy with just typing it's name. ex: instead of writing `../../../../settings`, you can go with `settings`
