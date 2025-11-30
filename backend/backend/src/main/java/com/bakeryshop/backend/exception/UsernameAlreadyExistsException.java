package com.bakeryshop.backend.exception;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException() {
        super("Username already taken");
    }

    public UsernameAlreadyExistsException(String message) {
        super(message);
    }
}
