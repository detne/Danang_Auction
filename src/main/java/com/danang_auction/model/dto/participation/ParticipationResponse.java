package com.danang_auction.model.dto.participation;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ParticipationResponse {
    private List<ParticipationRequest> data;
    private long total;
    private int page;
    private int limit;
}
