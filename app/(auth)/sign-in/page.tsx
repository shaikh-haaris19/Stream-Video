"use client"

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SignInSchema } from "@/Schemas/SignInSchema";

const SignIn = () => {

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {

    setLoading(true);

    try {

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (response?.error) {

        toast.error("Sign In Failed! Please check your credentials.");

      } else {

        toast.success("Sign In Successful! Redirecting...");
        router.push("/");

      }

    } catch (error) {

      console.error("Error during sign in:", error);
      toast.error("An error occurred during sign in. Please try again.");

    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center">

      <ToastContainer />

      <Card className="w-full shadow-xl border-2 sm:max-w-md">

        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">- Sign In -</CardTitle>
          <CardDescription className="text-center">
            Sign In to your account and start streaming your favorite content
          </CardDescription>
        </CardHeader>

        <CardContent>

          {/* Form Validation using React Hook Form */}
          <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>

            {/* Containing Form Feild : email & Password */}
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
                    />
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
                      placeholder="Enter Your Password"
                      className="h-12 px-4 text-base"
                    />
                  </Field>
                )}
              />

            </FieldGroup>

            {/* Button Of Reset and Submit */}
            <Field className="flex justify-center my-6 gap-4" orientation="horizontal">
              <Button className="h-12 px-4 text-base cursor-pointer" disabled={loading} type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button className="h-12 px-4 text-base cursor-pointer" disabled={loading} type="submit">
                Sign In
              </Button>
            </Field>

            {/* Navigate to Sign Up Page If User Doesn't Have An Account */}
            <p className="text-center mt-4 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}

export default SignIn
