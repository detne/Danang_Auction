package com.danang_auction.security.jwt;

public class JwtPayload {
    private Long sub;
    private String jti;
    private Long iat;
    private Long exp;

    public JwtPayload() {}

    public JwtPayload(Long sub, String jti, Long iat, Long exp) {
        this.sub = sub;
        this.jti = jti;
        this.iat = iat;
        this.exp = exp;
    }

    public Long getSub() {
        return sub;
    }

    public void setSub(Long sub) {
        this.sub = sub;
    }

    public String getJti() {
        return jti;
    }

    public void setJti(String jti) {
        this.jti = jti;
    }

    public Long getIat() {
        return iat;
    }

    public void setIat(Long iat) {
        this.iat = iat;
    }

    public Long getExp() {
        return exp;
    }

    public void setExp(Long exp) {
        this.exp = exp;
    }

    @Override
    public String toString() {
        return "JwtPayload{" +
                "sub=" + sub +
                ", jti='" + jti + '\'' +
                ", iat=" + iat +
                ", exp=" + exp +
                '}';
    }
}
