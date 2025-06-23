package com.danang_auction.controller;

import com.danang_auction.model.dto.auction.DepositDto;
import com.danang_auction.service.DepositService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private DepositService depositService;

    // API không cần xác thực Admin
    @GetMapping("/deposits")
    public ResponseEntity<List<DepositDto>> getDepositsForRefund() {
        // Lấy danh sách deposits đã được nạp
        List<DepositDto> deposits = depositService.getDepositsForRefund();

        // Trả về dữ liệu dưới dạng JSON với mã trạng thái 200 OK
        return ResponseEntity.ok(deposits);
    }
}
