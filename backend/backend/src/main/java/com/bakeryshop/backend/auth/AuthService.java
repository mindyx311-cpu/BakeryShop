package com.bakeryshop.backend.auth;

import com.bakeryshop.backend.exception.UsernameAlreadyExistsException;
import com.bakeryshop.backend.user.User;
import com.bakeryshop.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {

        // Username duplicate check
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already taken");
        }

        // Create a user and encrypt the password.
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
    }

    // Login Instructions (Full Version)
    public LoginResponse login(LoginRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }

        // I'll use a dummy token for now (I'll switch to JWT later).
        String dummyToken = "dummy-token";

        LoginResponse resp = new LoginResponse();
        resp.setUsername(user.getUsername());
        resp.setToken(dummyToken);
        return resp;
    }
}
