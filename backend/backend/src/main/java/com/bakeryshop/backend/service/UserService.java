package com.bakeryshop.backend.service;
import com.bakeryshop.backend.exception.UsernameAlreadyExistsException;
import com.bakeryshop.backend.user.User;
import com.bakeryshop.backend.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String username, String password) {

        if (userRepository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException();
        }


        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        return userRepository.save(user);
    }
}
