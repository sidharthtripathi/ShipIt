import { Form } from "@/components/ui/Form";

export default function Component() {

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-smfont-semibold mb-1">Frontend Deployer</div>
          <h1 className="block mt-1 text-lg leading-tight font-medium ">Deploy From Your Public GitHub Repository</h1>
          <p className="mt-2 ">Enter your repository URL and set up environment variables.</p>
          <Form/>
        </div>
      </div>
    </div>
  )
}