import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="px-10 py-4 border-t border-slate-400">
            <div className="container mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-lg font-semibold text-center sm:text-left">
                        Collabio: Collaborate in Realtime
                    </div>
                    <div>
                        <Link
                            href="https://github.com/ayushglitch/collabio"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit our GitHub page"
                        >
                            <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={30}
                                height={30}
                                className="invert hover:opacity-80 transition-opacity"
                            />
                        </Link>
                    </div>
                    <div className="text-sm text-center">
                        © {currentYear} Collabio. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
