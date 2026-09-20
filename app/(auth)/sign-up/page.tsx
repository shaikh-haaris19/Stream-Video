"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDebounceCallback } from 'usehooks-ts'
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form"
import { SignUpSchema } from "@/Schemas/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const SignUp = () => {

    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCheckingEmail, setIsCheckingEmail] = useState<boolean>(false);

    const debounced = useDebounceCallback(setEmail, 500)

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password does not match");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post("/api/sign-up", data);

            if (response.data.success) {
                router.push("/sign-in");
                toast.success("Account created successfully!");
            } else {
                toast.error(response.data.error || "Failed to create account");
            }


        } catch (error) {
            console.error("Error during sign up:", error);
            toast.error("An error occurred during sign up. Please try again.");

        } finally {
            setLoading(false);
        }

    }

    // Check email uniqueness when the email state changes Using Debounce to avoid excessive API calls
    useEffect(() => {

        const checkEmailUniuqueness = async () => {

            if (email) {

                setIsCheckingEmail(true);
                setIsEmailValid(false);

                try {

                    const response = await axios.post("/api/check-email", { email });

                    if (response.data.success) {
                        setIsEmailValid(true);
                    } else {
                        setIsEmailValid(false);
                    }

                } catch (error) {
                    const err = error as AxiosError<{ message: string }>;
                    toast.error(err.response?.data?.message || "Failed to check email uniqueness");

                } finally {
                    setIsCheckingEmail(false);
                }

            }

        }

        checkEmailUniuqueness();

    }, [email])

    return (
        <div className="flex min-h-screen items-center justify-center">

            <ToastContainer />

            <Card className="w-full shadow-xl border-2 sm:max-w-md">

                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">- Sign Up -</CardTitle>
                    <CardDescription className="text-center">
                        Sign up to create your account and start using our services
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>

                        {/* Containing Form Feild : email, Password, Confirm Password */}
                        <FieldGroup>

                            {/* Email Controller */}
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-semibold text-md ml-1" htmlFor={field.name}>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your email"
                                            className="h-12 px-4 text-base"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                        {isCheckingEmail && <Loader2 className="animate-spin" />}
                                        {isEmailValid && <FieldDescription>✅ Valid Email</FieldDescription>}
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {/* Password Controller */}
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-semibold text-md ml-1" htmlFor={field.name}>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Create a password"
                                            className="h-12 px-4 text-base"
                                        />
                                    </Field>
                                )}
                            />

                            {/* Confirm Password Controller */}
                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel className="font-semibold text-md ml-1" htmlFor={field.name}>
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Confirm your password"
                                            className="h-12 px-4 text-base"
                                        />
                                    </Field>
                                )}
                            />

                        </FieldGroup>

                        {/* Button Of Reset and Submit */}
                        <Field className="flex justify-center mt-4 gap-4" orientation="horizontal">
                            <Button className="h-12 px-4 text-base cursor-pointer" disabled={loading} type="button" variant="outline" onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button className="h-12 px-4 text-base cursor-pointer" disabled={loading} type="submit">
                                Sign Up
                            </Button>
                        </Field>

                        {/* Navigate to Sign In Page If User Already Have An Account */}
                        <p className="text-center mt-4 text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="/sign-in" className="text-blue-500 hover:underline">
                                Sign In
                            </a>
                        </p>

                    </form>
                </CardContent>

            </Card>

        </div>
    )
}

export default SignUp
