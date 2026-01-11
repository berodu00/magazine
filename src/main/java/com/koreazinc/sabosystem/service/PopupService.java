package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.PopupDto;
import com.koreazinc.sabosystem.entity.Popup;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import com.koreazinc.sabosystem.repository.PopupRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.util.HtmlSanitizerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PopupService {

    private final PopupRepository popupRepository;
    private final UserRepository userRepository;
    private final HtmlSanitizerUtil htmlSanitizerUtil;

    public List<PopupDto.ResponseDto> getActivePopups() {
        return popupRepository.findActivePopups(LocalDateTime.now())
                .stream()
                .map(PopupDto.ResponseDto::from)
                .collect(Collectors.toList());
    }

    public Page<PopupDto.ResponseDto> getAllPopups(Pageable pageable) {
        return popupRepository.findAll(pageable)
                .map(PopupDto.ResponseDto::from);
    }

    @Transactional
    public PopupDto.ResponseDto createPopup(PopupDto.RequestDto dto, Long userId) {
        validatePopup(dto);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String safeContent = dto.getContent() != null ? htmlSanitizerUtil.sanitize(dto.getContent()) : null;

        Popup popup = Popup.builder()
                .title(dto.getTitle())
                .popupType(dto.getPopupType())
                .imageUrl(dto.getImageUrl())
                .content(safeContent)
                .linkUrl(dto.getLinkUrl())
                .displayOrder(dto.getDisplayOrder())
                .isActive(dto.getIsActive())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .createdBy(user)
                .build();

        popupRepository.save(popup);
        return PopupDto.ResponseDto.from(popup);
    }

    @Transactional
    public PopupDto.ResponseDto updatePopup(Long id, PopupDto.RequestDto dto) {
        validatePopup(dto);

        Popup popup = popupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Popup not found"));

        String safeContent = dto.getContent() != null ? htmlSanitizerUtil.sanitize(dto.getContent()) : null;

        popup.update(
                dto.getTitle(),
                dto.getPopupType(),
                dto.getImageUrl(),
                safeContent,
                dto.getLinkUrl(),
                dto.getDisplayOrder(),
                dto.getIsActive(),
                dto.getStartDate(),
                dto.getEndDate());

        return PopupDto.ResponseDto.from(popup);
    }

    @Transactional
    public void deletePopup(Long id) {
        if (!popupRepository.existsById(id)) {
            throw new ResourceNotFoundException("Popup not found");
        }
        popupRepository.deleteById(id);
    }

    private void validatePopup(PopupDto.RequestDto dto) {
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
    }
}
