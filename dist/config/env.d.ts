import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
    PORT: z.ZodEffects<z.ZodString, number, string>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    JWT_SECRET: z.ZodString;
    JWT_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    MAX_FILE_SIZE: z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>;
}, "strip", z.ZodTypeAny, {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MAX_FILE_SIZE: number;
}, {
    DATABASE_URL: string;
    PORT: string;
    JWT_SECRET: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    JWT_EXPIRES_IN?: string | undefined;
    MAX_FILE_SIZE?: string | undefined;
}>;
export declare const env: {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MAX_FILE_SIZE: number;
};
export type Env = z.infer<typeof envSchema>;
export {};
//# sourceMappingURL=env.d.ts.map