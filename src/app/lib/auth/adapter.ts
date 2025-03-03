import { Adapter, AdapterUser } from "next-auth/adapters"
import { executeQuery } from "@/app/lib/db"

export function SQLServerAdapter(): Adapter {
  return {
    async createUser(data: { name: any; email: any; password: any }) {
      const result = await executeQuery(
        "INSERT INTO Users (name, email, password) VALUES (@param0, @param1, @param2); SELECT SCOPE_IDENTITY() as id",
        [data.name, data.email, data.password]
      )
      return { ...data, id: result[0].id }
    },

    async getUser(id) {
      const users = await executeQuery(
        "SELECT * FROM Users WHERE id = @param0",
        [id]
      )
      return users[0] || null
    },

    async getUserByEmail(email) {
      const users = await executeQuery(
        "SELECT * FROM Users WHERE email = @param0",
        [email]
      )
      return users[0] || null
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const result = await executeQuery(
        "UPDATE Users SET name = @param0, email = @param1 WHERE id = @param2",
        [user.name ?? '', user.email ?? '', user.id]
      )
      if (!this.getUser) {
        throw new Error("getUser method is not defined")
      }
      const updatedUser = await this.getUser(user.id)
      return updatedUser as AdapterUser
    },

    async deleteUser(userId) {
      await executeQuery(
        "DELETE FROM Users WHERE id = @param0",
        [userId]
      )
    }
  }
}