package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.IdeaDto;
import com.koreazinc.sabosystem.entity.Idea;
import com.koreazinc.sabosystem.entity.IdeaStatus;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.exception.ResourceNotFoundException;
import com.koreazinc.sabosystem.repository.IdeaRepository;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.util.HtmlSanitizerUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final UserRepository userRepository;
    private final HtmlSanitizerUtil htmlSanitizerUtil;

    @Transactional
    public IdeaDto.ResponseDto createIdea(IdeaDto.RequestDto dto, Long userId) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("제목을 입력해주세요.");
        }
        if (dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("내용을 입력해주세요.");
        }

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));

        Idea idea = Idea.builder()
                .title(dto.getTitle())
                .content(htmlSanitizerUtil.sanitize(dto.getContent()))
                .author(author)
                .build();

        ideaRepository.save(idea);
        return IdeaDto.ResponseDto.from(idea);
    }

    public Page<IdeaDto.ResponseDto> getIdeas(Pageable pageable, IdeaStatus statusTarget) {
        Page<Idea> ideas;
        if (statusTarget != null) {
            ideas = ideaRepository.findByStatus(statusTarget, pageable);
        } else {
            ideas = ideaRepository.findAll(pageable);
        }
        return ideas.map(IdeaDto.ResponseDto::from);
    }

    public Page<IdeaDto.ResponseDto> getMyIdeas(Pageable pageable, Long userId) {
        return ideaRepository.findByAuthor_UserId(userId, pageable)
                .map(IdeaDto.ResponseDto::from);
    }

    @Transactional
    public IdeaDto.ResponseDto updateIdeaStatus(Long ideaId, IdeaDto.StatusUpdateDto dto) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new ResourceNotFoundException("아이디어를 찾을 수 없습니다."));

        idea.updateStatus(dto.getStatus(), dto.getAdminReply());
        return IdeaDto.ResponseDto.from(idea);
    }
}
