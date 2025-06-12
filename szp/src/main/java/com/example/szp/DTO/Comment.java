package com.example.szp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Comment {
    UserDataShort user;
    TaskDataShort task;
    String comment;
    LocalDateTime commentDate;
}
