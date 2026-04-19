// "use client";

// import { useEffect } from "react";
// import { useClerk } from "@clerk/nextjs";

// export default function SsoCallback() {
//   const { handleRedirectCallback } = useClerk();

//   useEffect(() => {

//     // Clerk will finish the OAuth handshake here
//     handleRedirectCallback().then(() => {
//         // console.log(e);
//         window.location.href = "/dashboard"; 
//       })
//       .catch((err) => {
//         console.error("OAuth error:", err);
//       });
//   }, [handleRedirectCallback]);

//   return <p>Finishing sign-in…</p>;
// }

// src/app/(auth)/signin/sso-callback/[[...index]]/page.tsx
"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function Page() {
//   const router = useRouter();
//   const [returnUrl, setReturnUrl] = useState("/dashboard");

//   useEffect(() => {
//     const stored = sessionStorage.getItem("returnUrl");
//     if (stored) {
//       setReturnUrl(stored);
//       sessionStorage.removeItem("returnUrl");
//     }
//   }, []);

  return (
    <AuthenticateWithRedirectCallback />
  );
}
