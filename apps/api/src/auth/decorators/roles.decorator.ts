import { SetMetadata } from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

export const ROLES_KEY = 'roles';

// @Roles(Role.ADMIN) restricts a route to users with matching role.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
