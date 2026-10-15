package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func RecoveryMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("🔥 [PANIC RECOVERED]: %v", r)
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"success": false,
					"message": "An unexpected internal server error occurred",
					"error":   "internal_server_panic",
				})
			}
		}()
		c.Next()
	}
}
