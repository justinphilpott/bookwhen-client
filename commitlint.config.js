export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation
        'style', // formatting, missing semi colons, etc
        'refactor', // refactoring code
        'perf', // performance improvements
        'test', // adding tests
        'build', // changes that affect the build system or external dependencies
        'ci', // changes to CI configuration files and scripts
        'chore', // other changes that don't modify src or test files
        'RELEASING' // add your custom type here
      ],
    ],
    // loosen checking rules to allow changesets "RELEASING: Startcase..." 
    // style commits created by "changeset version" to pass checks
    'type-case': [2, 'always', ['lower-case', 'upper-case']],
    // 'subject-case': [2, 'always', ['lower-case', 'sentence-case']]
  },
};
