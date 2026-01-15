import { Suspense } from "react";
import LoginClient from "./components/LoginClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  )
}