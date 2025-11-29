import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export type Chat = {
  id: string
  user_id: string
  title: string
  description?: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export type Message = {
  id: string
  chat_id: string
  user_id: string
  content: string
  role: "user" | "assistant"
  created_at: Date
  updated_at: Date
}

// Chat operations
export async function createChat(userId: string, title: string, description?: string): Promise<Chat> {
  const result = await sql`
    INSERT INTO chats (user_id, title, description)
    VALUES (${userId}, ${title}, ${description || null})
    RETURNING *
  `
  return result[0] as Chat
}

export async function getChats(userId: string): Promise<Chat[]> {
  const result = await sql`
    SELECT * FROM chats
    WHERE user_id = ${userId} AND deleted_at IS NULL
    ORDER BY created_at DESC
  `
  return result as Chat[]
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  const result = await sql`SELECT * FROM chats WHERE id = ${chatId} AND deleted_at IS NULL`
  return result.length > 0 ? (result[0] as Chat) : null
}

export async function updateChat(chatId: string, title?: string, description?: string): Promise<Chat> {
  const updates: string[] = []
  const values: (string | undefined)[] = []
  let paramCount = 1

  if (title !== undefined) {
    updates.push(`title = $${paramCount++}`)
    values.push(title)
  }
  if (description !== undefined) {
    updates.push(`description = $${paramCount++}`)
    values.push(description)
  }
  updates.push(`updated_at = NOW()`)

  values.push(chatId)
  const updateStr = updates.join(", ")

  const result = await sql.query(`UPDATE chats SET ${updateStr} WHERE id = $${paramCount} RETURNING *`, values)
  return result[0] as Chat
}

export async function deleteChat(chatId: string): Promise<void> {
  await sql`UPDATE chats SET deleted_at = NOW() WHERE id = ${chatId}`
}

// Message operations
export async function addMessage(
  chatId: string,
  userId: string,
  content: string,
  role: "user" | "assistant",
): Promise<Message> {
  const result = await sql`
    INSERT INTO messages (chat_id, user_id, content, role)
    VALUES (${chatId}, ${userId}, ${content}, ${role})
    RETURNING *
  `
  return result[0] as Message
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const result = await sql`
    SELECT * FROM messages
    WHERE chat_id = ${chatId}
    ORDER BY created_at ASC
  `
  return result as Message[]
}

export async function deleteMessages(chatId: string): Promise<void> {
  await sql`DELETE FROM messages WHERE chat_id = ${chatId}`
}

// User operations
export type User = {
  id: string
  full_name: string
  email: string
  username: string
  password_hash?: string
  birth_date: string
  professional_title?: string
  pdf_url?: string
  created_at: Date
  updated_at: Date
}

export async function createUser(
  fullName: string,
  email: string,
  username: string,
  passwordHash: string,
  birthDate: string,
  professionalTitle?: string,
  pdfUrl?: string,
): Promise<User> {
  try {
    const result = await sql`
      INSERT INTO users (full_name, email, username, password_hash, birth_date, professional_title, pdf_url)
      VALUES (${fullName}, ${email.toLowerCase()}, ${username.toLowerCase()}, ${passwordHash}, ${birthDate}, ${professionalTitle || null}, ${pdfUrl || null})
      RETURNING id, full_name, email, username, birth_date, professional_title, pdf_url, created_at, updated_at
    `
    return result[0] as User
  } catch (error: any) {
    if (error.message.includes("unique constraint")) {
      if (error.message.includes("email")) {
        throw new Error("El correo electrónico ya está registrado")
      }
      if (error.message.includes("username")) {
        throw new Error("El nombre de usuario ya está en uso")
      }
    }
    throw error
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, full_name, email, username, password_hash, birth_date, professional_title, pdf_url, created_at, updated_at, "isPlus", plus_date
    FROM users
    WHERE (email = ${email.toLowerCase()} OR username = ${email.toLowerCase()}) AND deleted_at IS NULL
  `
  return result.length > 0 ? (result[0] as User) : null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, full_name, email, username, password_hash, birth_date, professional_title, pdf_url, created_at, updated_at, "isPlus", plus_date
    FROM users
    WHERE id = ${id} AND deleted_at IS NULL
  `
  return result.length > 0 ? (result[0] as User) : null
}

// Admin operations
export async function getAdminStats() {
  try {
    // Get total users count
    const usersResult = await sql`SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL`
    const totalUsers = usersResult[0]?.count || 0

    // Get active professionals (users with professional_title not null)
    // const professionalsResult = await sql`SELECT COUNT(*) as count FROM users WHERE professional_title IS NOT NULL AND deleted_at IS NULL`
    const activeProfessionals = 0

    // Get total sessions (total messages in chats)
    const sessionsResult = await sql`SELECT COUNT(*) as count FROM messages`
    const totalSessions = sessionsResult[0]?.count || 0

    // Get new users this week
    const weekAgoResult = await sql`SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '7 days' AND deleted_at IS NULL`
    const newUsersThisWeek = weekAgoResult[0]?.count || 0

    // Get free chat sessions this week
    const freeChatsResult = await sql`SELECT COUNT(*) as count FROM chats WHERE created_at >= NOW() - INTERVAL '7 days' AND deleted_at IS NULL`
    const freeChatsThisWeek = freeChatsResult[0]?.count || 0

    // Get premium sessions this week
    const premiumSessionsResult = await sql`SELECT COUNT(*) as count FROM payments WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '7 days'`
    const premiumSessionsThisWeek = premiumSessionsResult[0]?.count || 0

    // Get conversions to premium
    const conversionsResult = await sql`SELECT COUNT(DISTINCT user_id) as count FROM payments WHERE status = 'completed'`
    const conversionsToPremiun = conversionsResult[0]?.count || 0

    // Get monthly revenue
    const revenueResult = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '30 days'`
    console.log("Revenue Result:", revenueResult)
    const monthlyRevenue = Number(revenueResult[0]?.total || 0)

    // Get active subscriptions
    const subscriptionsResult = await sql`SELECT COUNT(*) as count FROM users WHERE "isPlus" = true AND plus_date >= NOW() - INTERVAL '30 days' AND deleted_at IS NULL`
    const activeSubscriptions = subscriptionsResult[0]?.count || 0

    // Get retention rate (users with chats)
    const retentionRate = totalUsers > 0 ? parseFloat(((totalUsers / totalUsers) * 100).toFixed(1)) : 0

    // Get average revenue per user
    const avgRevenueResult = await sql`SELECT COUNT(DISTINCT user_id) as user_count, COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'`
    const avgRevenueData = avgRevenueResult[0]
    const avgRevenuePerUser = avgRevenueData.user_count > 0 ? Number((avgRevenueData.total / avgRevenueData.user_count).toFixed(2)) : 0

    // Calculate growth percentage (compared to last month)
    const lastMonthRevenueResult = await sql`SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '60 days' AND created_at < NOW() - INTERVAL '30 days'`
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0
    const growthPercentage =
      lastMonthRevenue > 0
        ? (((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
        : monthlyRevenue > 0
          ? 100
          : 0

    return {
      totalUsers,
      activeProfessionals,
      totalSessions,
      growthPercentage,
      platformUsage: {
        freeChatsThisWeek,
        premiumSessionsThisWeek,
        newUsersThisWeek,
        conversionsToPremiun,
      },
      revenue: {
        monthlyRevenue: Number(monthlyRevenue),
        activeSubscriptions,
        retentionRate: Number(retentionRate),
        avgRevenuePerUser: Number(avgRevenuePerUser),
      },
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    throw error
  }
}
