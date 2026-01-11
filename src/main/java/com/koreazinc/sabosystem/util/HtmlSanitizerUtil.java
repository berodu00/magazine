package com.koreazinc.sabosystem.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizerUtil {

    private final Safelist safelist;

    public HtmlSanitizerUtil() {
        this.safelist = Safelist.basicWithImages()
                .addTags("div", "h1", "h2", "h3", "h4", "h5", "h6", "span", "br", "hr")
                .addAttributes("div", "style", "class")
                .addAttributes("span", "style", "class")
                .addAttributes("p", "style", "class")
                .addAttributes("img", "style", "class")
                .addProtocols("img", "src", "http", "https", "data"); // Allow base64 images if needed, or restricting
                                                                      // to http/https
    }

    public String sanitize(String html) {
        if (html == null) {
            return null;
        }
        Document.OutputSettings outputSettings = new Document.OutputSettings();
        outputSettings.prettyPrint(false); // Preserve whitespace/formatting as much as possible for editor
        return Jsoup.clean(html, "", safelist, outputSettings);
    }
}
