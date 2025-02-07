import { DbService } from "src/db/db.service";
import { UserService } from "src/users/users.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class RoleService {
    constructor(private db: DbService, private userService: UserService) {}

    async addRoleToUserByEmail(email: string, newRole: string) {
        const user = await this.userService.findByEmail(email)

        if(!user) {
            throw new NotFoundException(`User was not fount by email: ${email}`)
        }

        const role = await this.db.role.findUnique({
            where: {
                name: newRole
            }
        })

        if(!role) {
            throw new NotFoundException(`Role: ${newRole} does not exist`)
        }

        if(user.roles.find(userRole => userRole.name === role.name)) {
            throw new BadRequestException(`User already has the role: ${role}`)
        }

        await this.userService.addRole(user.id, role.id)

        return { message: `Role "${newRole}" successfully assigned to user "${email}"` };
    }

    async removeRoleFromUserByEmail(email: string, roleToRemove: string) {
        const user = await this.userService.findByEmail(email)

        if(!user) {
            throw new NotFoundException(`User was not fount by email: ${email}`)
        }

        const role = await this.db.role.findUnique({
            where: {
                name: roleToRemove
            }
        })

        if(!role) {
            throw new NotFoundException(`Role: ${roleToRemove} does not exist`)
        }

        await this.userService.removeRole(user.id, role.id)

        return { message: `Role "${roleToRemove}" successfully removed from user "${email}"` };
    }
}