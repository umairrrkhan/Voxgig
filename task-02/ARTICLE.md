# Aontu: configuration conflicts are helpful; incomplete schemas are still risky

*By Umair Khan | 13 October 2026*

Aontu combines data, defaults, and constraints through unification. Two compatible declarations produce a more specific result; contradictory declarations fail. For an SDK generator, that can prevent a project setting from silently replacing a requirement established elsewhere. My recommendation is to consider it when several sources contribute to one configuration, provided the team is prepared to learn its schema rules.

The difficult part is deciding what the model must forbid. A successful evaluation establishes consistency with the written constraints. It cannot establish that those constraints express the intended behaviour. The examples below show both the benefit and the gap.

## Defaults express permission to change

These examples target the npm package `aontu@0.76.0` on Node.js 24 or later. Install it in a scratch directory:

```sh
npm install --save-exact aontu@0.76.0
```

Save this JavaScript as `example.cjs` and run `node example.cjs`:

```js
const { Aontu } = require('aontu');

const config = new Aontu().generate(`
  service: close({
    host: *"localhost" | string
    port: *8080 | integer
  })
  service: { port: 9090 }
`);

console.log(config);
// { service: { host: 'localhost', port: 9090 } }
```

The preferred value `*8080` supplies a default; the `integer` alternative admits another integer. The concrete declaration selects 9090. The host remains localhost because nothing supplies another value.

This is a compact way to keep defaults near their constraints. A reader can see that the port may vary, whereas a plain integer literal makes a stronger claim. In a generator model, that distinction separates a project's configurable choice from an invariant.

It also demands deliberate authoring. Someone accustomed to environment files replacing earlier values might write two concrete ports:

```aontu
service: port: 8080
service: port: 9090
```

Aontu rejects that conflict rather than choosing the later line. Reversing the declarations also fails. I prefer this behaviour for incompatible generator settings: file order should not decide whether a contradiction disappears. For configuration designed around precedence, however, migrating to Aontu requires rewriting fixed values as defaults where replacement is intended. Renaming files or rearranging includes will not supply that policy.

## Open maps can accept mistakes

The first example uses `close()` deliberately. Aontu maps otherwise permit additional keys, allowing separate declarations to contribute fields.

That flexibility has a practical downside:

```aontu
service: { port: *8080 | integer }
service: { porrt: 9090 }
```

This evaluates successfully with both `port: 8080` and `porrt: 9090`. The intended setting has not changed. A consumer that reads `port` will still use the default, even though the author supplied something resembling an override.

This is permitted behaviour, not a parser defect. My criticism concerns the adoption cost: a demonstration of successful composition can make an open model look more protective than it is. Boundary schemas need an explicit decision about unknown keys.

For a small application, I would close the configuration the application consumes. For an extensible generator, I would keep extension containers open while closing established option records. Closing every map indiscriminately could reject legitimate additions, so the choice belongs in the model design and its tests.

## A list literal is not an element schema

Lists require similar care. This declaration constrains the first position:

```aontu
labels: [string]
labels: ["public", 7]
```

The second element is accepted. To constrain each element, Aontu uses a spread:

```aontu
labels: [&: string]
labels: ["public", 7]
```

That version rejects the number. The difference is one operator, with a substantial difference in validation.

The positional interpretation is internally consistent: lists can describe specific positions. Nevertheless, `[string]` resembles notation developers encounter in other schema systems, where it can suggest a list of strings. I would make this distinction an early onboarding exercise, with a failing second-element example rather than a definition alone.

In a review, I would test invalid inputs alongside successful output: a misspelled option, a wrong element after position zero, and a conflicting value contributed elsewhere. Those checks examine the schema's coverage. A passing example with one valid string does not.

## Constraints still need domain knowledge

Even the closed configuration in the first example admits `port: 70000`, because it asks for an integer without declaring a port range. Closing a map rejects undeclared keys; it does not complete the rules for declared values.

For an SDK model, the same limitation applies to HTTP methods, parameter locations, or an upstream response description. A consistent description can still disagree with the service. I would pair model evaluation with requests against documented endpoints and assertions about response structure. Unification cannot discover a contract mismatch without another declaration or a test that reveals it.

This is also why I would keep a failed model input as a regression case after fixing it. The error demonstrates that two declarations conflict; deciding which declaration should change remains an engineering judgement.

## Debugging and operational boundaries

Aontu's documentation includes source-located errors, provenance queries, and a language server. Those facilities address the difficulty of tracing a value assembled from several declarations. They deserve attention before introducing a large collection of includes: short syntax does not make a distributed definition easy to debug automatically.

There is a separate trust decision when documents come from outside the project. The documented include resolver is unconfined by default. A host evaluating untrusted input should select a restricted `trust.include` policy, such as denying includes or confining resolution to a chosen root. Schema validation and filesystem access restrictions solve different problems. I have not audited that implementation.

For a single configuration file with little composition, I would start with ordinary data and an explicit validator to avoid another language. For a generator assembled from reusable definitions, Aontu's defaults and conflict detection justify a closer evaluation. Before adopting it, I would require reviewed boundary schemas, negative fixtures, reproducible dependency versions, and contract tests for the generated client.

*AI assisted research and drafting. The linked checks execute the article's examples; this review does not claim a performance benchmark or security audit.*

## References

- [Aontu source and overview](https://github.com/aontu-lang/aontu)
- [Configuration tutorial](https://github.com/aontu-lang/aontu/blob/main/docs/tutorial-config.md)
- [Language reference](https://github.com/aontu-lang/aontu/blob/main/docs/reference-language.md)
- [API and trust options](https://github.com/aontu-lang/aontu/blob/main/docs/reference-api.md)
- [Trust contract](https://github.com/aontu-lang/aontu/blob/main/docs/trust.md)
- [Example checks](examples.test.cjs) and [verification evidence](evidence.json)
