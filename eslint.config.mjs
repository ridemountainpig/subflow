import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
    ...nextVitals,
    {
        ignores: [
            // Default ignores of eslint-config-next:
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
];

export default eslintConfig;
