/**
 * Tag Data Events
 *  
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * Tag Data Events
 */
export interface ReadTagEventModel { 
    /**
     * Type of operating mode
     */
    type: TagDataEvents.TypeEnum;
    /**
     * Tag Data Events timestamp
     */
    timestamp: Date;
    data: string;
}
export namespace TagDataEvents {
    export type TypeEnum = 'SIMPLE' | 'INVENTORY' | 'PORTAL' | 'CONVEYOR' | 'CUSTOM';
    export const TypeEnum = {
        SIMPLE: 'SIMPLE' as TypeEnum,
        INVENTORY: 'INVENTORY' as TypeEnum,
        PORTAL: 'PORTAL' as TypeEnum,
        CONVEYOR: 'CONVEYOR' as TypeEnum,
        CUSTOM: 'CUSTOM' as TypeEnum
    };
}