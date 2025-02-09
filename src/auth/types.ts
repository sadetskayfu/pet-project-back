import { type Role } from "src/roles/types"

export type ConfirmationSessionInfo = {
	id: number
	email: string
	isConfirmed: boolean
	iat: number
	exp: number
}

export interface SessionInfo extends ConfirmationSessionInfo {
	roles: Role[]
}