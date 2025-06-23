package com.danang_auction.service;

import com.danang_auction.model.dto.auction.DepositDto;
import com.danang_auction.repository.DepositRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepositService {

    @Autowired
    private DepositRepository depositRepository;

    public List<DepositDto> getDepositsForRefund() {
        return depositRepository.findDepositsForRefund();
    }
}
