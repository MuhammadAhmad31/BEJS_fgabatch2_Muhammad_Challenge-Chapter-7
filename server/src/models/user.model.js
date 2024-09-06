import prisma from "../config/prisma.js";

export const findUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });
};

export const findRoleByName = (name) => {
  return prisma.role.findUnique({ where: { name } });
};

export const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });
}

export const updateUserPassword = async (userId, hashedPassword) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });
};

export const createUser = async (userData) => {
  return prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: userData.password, 
      name: userData.name,
      role: {
        connect: { name: userData.roleName || 'USER' },
      },
    },
  });
};

export const findOrCreateUser = async (profile) => {
  let user = await prisma.user.findUnique({
    where: { id: profile.id },
  });

  let role = await prisma.role.findUnique({
    where: { name: 'USER' },
  });

  // console.log(profile);
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: profile.id,
        username: profile.displayName,
        roleId: role.id,
        name: profile.displayName,
        password: "",
      },
    });
  }

  return user;
};