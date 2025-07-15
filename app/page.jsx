import Image from "next/image";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left">
                    <h1 className="mb-5 pr-16 text-3xl font-bold text-black xl:text-[44px]">Welcome to <br/> Searchmind Apex</h1>

                </ol>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Searchmind 2025
                </a>
            </footer>
        </div>
    );
}
