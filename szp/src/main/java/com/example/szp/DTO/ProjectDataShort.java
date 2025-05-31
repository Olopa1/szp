package com.example.szp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDataShort {
    Long id;
    String projectName;
    String company;
    String projectCountry;
    Boolean archived;
}
