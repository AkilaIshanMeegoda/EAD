/*  SE4040 – EV Charging Backend
    File: ValidationException.cs
    Purpose: Custom exception to represent validation errors consistently.
*/

using System;
using System.Collections.Generic;

namespace EVCharge.Backend.Common
{
    /// <summary>
    /// Custom exception used to capture validation errors and return
    /// structured details via ProblemDetailsMiddleware.
    /// </summary>
    public class ValidationException : Exception
    {
        /// <summary>Collection of validation error messages.</summary>
        public List<string> Errors { get; } = new();

        public ValidationException(string message) : base(message) { }

        public ValidationException(string message, IEnumerable<string> errors) : base(message)
        {
            Errors.AddRange(errors);
        }
    }
}
