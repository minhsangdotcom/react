import { TRANSLATION_KEYS } from "@/config/translationKey";
import { Github, Linkedin, Mail, Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-background px-6 py-4 text-sm text-muted-foreground">
      <div className="flex flex-col gap-2 items-center justify-between md:flex-row">
        {/* Left: Author */}
        <div className="flex flex-col md:flex-row gap-2">
          <span className="text-center">© {new Date().getFullYear()} CMS</span>
          <span className="hidden md:inline">•</span>
          <span>
            {t(TRANSLATION_KEYS.footer.builtBy)}{"\t"}
            <strong className="text-foreground">Tran Minh Sang</strong>
          </span>
        </div>

        {/* Right: Social links */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/minhsangdotcom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/sang-tran-b78431352/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:minhsang.work25@gmail.com"
            className="hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="h-4 w-4" />
          </a>

          <a
            href="https://www.facebook.com/sang.minh97"
            className="hover:text-foreground transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
