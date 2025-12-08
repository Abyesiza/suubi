"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">
          Sign in to your account to continue
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0 bg-transparent w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "border border-border hover:bg-accent transition-colors",
            formButtonPrimary:
              "bg-brand-teal hover:bg-brand-teal/90 text-white",
            footerActionLink: "text-brand-teal hover:text-brand-teal/80",
            formFieldInput:
              "border-border focus:ring-brand-teal focus:border-brand-teal",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            identityPreviewEditButton: "text-brand-teal",
          },
          layout: {
            socialButtonsPlacement: "top",
            socialButtonsVariant: "iconButton",
          },
        }}
        redirectUrl="/patient"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
