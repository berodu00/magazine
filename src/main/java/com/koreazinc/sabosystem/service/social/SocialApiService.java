package com.koreazinc.sabosystem.service.social;

import com.koreazinc.sabosystem.entity.SocialContent;
import java.util.List;

public interface SocialApiService {
    /**
     * Fetch latest content from the social platform.
     * 
     * @return List of social content items
     */
    List<SocialContent> fetchLatestContent();

    /**
     * Get the platform name (e.g., "YOUTUBE", "INSTAGRAM")
     */
    String getPlatform();
}
