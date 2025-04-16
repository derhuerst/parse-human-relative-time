import {fileURLToPath} from 'node:url'
import eslint from '@eslint/js'
import {includeIgnoreFile} from '@eslint/compat'
import globals from 'globals'

const pathToGitignore = fileURLToPath(new URL('.gitignore', import.meta.url))

export default [
	eslint.configs.recommended,
	includeIgnoreFile(pathToGitignore),
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.node,
		},
		rules: {
			'no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: false
				},
			],
		},
	},
]
