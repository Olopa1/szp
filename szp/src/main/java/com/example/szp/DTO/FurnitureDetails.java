package com.example.szp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FurnitureDetails {
    Long id;
    String furnitureCode;
    String furnitureName;
    ProjectDataShort project;
}
