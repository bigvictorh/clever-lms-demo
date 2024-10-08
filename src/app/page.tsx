import VegaLogo from '@/app/ui/vega-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { inter } from '@/app/ui/fonts';
import Image from 'next/image';


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        {<VegaLogo />}
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${inter.className} text-xl text-gray-800 md:text-3xl md:leading-normal`} >
            <strong>Welcome to Vega.</strong> This is an example application integrated with {' '}
            <a href="https://dev.clever.com/v3.1/docs/lms-connect" className="text-blue-500">
              Clever LMS Connect
            </a>
            .
          </p>
          <Link
            href="/dashboard"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href={`https://clever.com/oauth/authorize?response_type=code&client_id=${process.env.CLEVER_ID}&redirect_uri=${process.env.CLEVER_REDIRECT_URI}&district_id=657b33ea13c57b042a145fba`}
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base">
            <span>Login with Clever</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>

        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here 
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          /> */}
        </div>
      </div>
    </main>
  );
}
