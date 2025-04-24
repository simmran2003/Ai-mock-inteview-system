import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url(/signupBG.gif)",
      }}
    >
      <SignUp/>
    </div>
  );
}
