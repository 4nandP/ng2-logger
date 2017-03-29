export interface ILogger<T> {
/**
 * Logs message and data with the level=data
 * @param message The message
 * @param otherParams Additional parameters
 */
    data(message: string, ...otherParams: any[]);

/**
 * Logs message and data with the level=error
 * @param message The message
 * @param otherParams Additional parameters
 */
    error(message: string, ...otherParams: any[]);

/**
 * Logs message and data with the level=info
 * @param message The message
 * @param otherParams Additional parameters
 */
    info(message: string, ...otherParams: any[]);

/**
 * Logs message and data with the level=warn
 * @param message The message
 * @param otherParams Additional parameters
 */
    warn(message: string, ...otherParams: any[]);
}
