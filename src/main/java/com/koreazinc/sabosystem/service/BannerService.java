package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.BannerDto;
import com.koreazinc.sabosystem.entity.Banner;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import com.koreazinc.sabosystem.repository.BannerRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository bannerRepository;
    private final UserRepository userRepository;

    public List<BannerDto.ResponseDto> getActiveBanners() {
        return bannerRepository.findActiveBanners()
                .stream()
                .map(BannerDto.ResponseDto::from)
                .collect(Collectors.toList());
    }

    public Page<BannerDto.ResponseDto> getAllBanners(Pageable pageable) {
        return bannerRepository.findAll(pageable)
                .map(BannerDto.ResponseDto::from);
    }

    @Transactional
    public BannerDto.ResponseDto createBanner(BannerDto.RequestDto dto, Long userId) {
        validateBanner(dto);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Banner banner = Banner.builder()
                .title(dto.getTitle())
                .imageUrl(dto.getImageUrl())
                .linkUrl(dto.getLinkUrl())
                .displayOrder(dto.getDisplayOrder())
                .isActive(dto.getIsActive())
                .createdBy(user)
                .build();

        bannerRepository.save(banner);
        return BannerDto.ResponseDto.from(banner);
    }

    @Transactional
    public BannerDto.ResponseDto updateBanner(Long id, BannerDto.RequestDto dto) {
        validateBanner(dto);

        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found"));

        banner.update(
                dto.getTitle(),
                dto.getImageUrl(),
                dto.getLinkUrl(),
                dto.getDisplayOrder(),
                dto.getIsActive());

        return BannerDto.ResponseDto.from(banner);
    }

    @Transactional
    public void deleteBanner(Long id) {
        if (!bannerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Banner not found");
        }
        bannerRepository.deleteById(id);
    }

    private void validateBanner(BannerDto.RequestDto dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (dto.getImageUrl() == null || dto.getImageUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("Image URL is required");
        }
    }
}
