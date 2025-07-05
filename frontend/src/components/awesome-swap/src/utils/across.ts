import {
    AcrossBridgeMetadataDto,
    AcrossBridgeDto as CodegenAcrossBridgeDto,
  } from "../types";
  
  export interface AcrossBridgeDto extends CodegenAcrossBridgeDto {
    type: "across-bridge";
    metadata: AcrossBridgeMetadataDto;
  }
  