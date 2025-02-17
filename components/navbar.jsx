import React, { useState } from "react";
import Image from "next/image";
import { IconWallet } from '@tabler/icons';
import logoPicWhite from "../public/pgmsoft_white.png";
import logoPicColor from "../public/pgmsoft_color.png";
import Metamsk from "../utils/checkMetask";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";
import { signOut, useSession } from "next-auth/react";
import { showNotification } from '@mantine/notifications';


import {
  createStyles,
  Header,
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  Avatar,
  ActionIcon, useMantineColorScheme
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconSun, IconMoonStars 
} from "@tabler/icons";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: -theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md}px ${theme.spacing.md * 2}px`,
    paddingBottom: theme.spacing.xl,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export default function Navbar () {

  const { data: session, status } = useSession();

  
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'light';
  
  const { metamask } = Metamsk();
  const [loginProgress, setLoginProgress] = useState(false);

    const handleAuth = async () => {
    try {
      if (isConnected) {
        await disconnectAsync();
      }
      const { account, chain } = await connectAsync({
        connector: new MetaMaskConnector(),
      });
        setLoginProgress(true);
        const { message } = await requestChallengeAsync({
              address: account,
              chainId: chain.id
        });
      
        const signature = await signMessageAsync({ message });
        const { url } = await signIn("moralis-auth", {
          message,
          signature,
          redirect: false,
          callbackUrl: "/profile",
        });
        push(url);
      } catch(error) {
        console.log("Error: " + JSON.stringify(error, null, 2))
        setLoginProgress(false);
        showNotification({
            autoClose:false,
            color: 'red',
            title: error.code,
            message: error.reason + " " + error.from,
        });
      }
  }


  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.fn.primaryColor()} />
        </ThemeIcon>
        <div>
          <Text size="sm" weight={500}>
            {item.title}
          </Text>
          <Text size="xs" color="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));
  return (
    <Box pb={40}>
      <Header height={80} px="xl">
        <Group position="apart" sx={{ height: "100%" }}>
          {dark ?
            <Link href="/">
                <Image
                  src={logoPicColor}
                  alt="PGMSOFT LTD"
                  priority
                  width={250}
                  height={50}
                /> 
            </Link>
            : 
            <Link href="/">
              <Image
                src={logoPicWhite}
                alt="PGMSOFT LTD"
                priority
                width={250}
                height={50}
              />
            </Link>  
          }
          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/" className={classes.link}>
              Home
            </Link>
            {/* <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Features
                    </Box>
                    <IconChevronDown
                      size={16}
                      color={theme.fn.primaryColor()}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown sx={{ overflow: "hidden" }}>
                <Group position="apart" px="md">
                  <Text weight={500}>Features</Text>
                  <Anchor href="#" size="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider
                  my="sm"
                  mx="-md"
                  color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
                />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group position="apart">
                    <div>
                      <Text weight={500} size="sm">
                        Get started
                      </Text>
                      <Text size="xs" color="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard> */}
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              
            </a>
          </Group>
          <Group className={classes.hiddenMobile}>
          
            {metamask 
                ? 
                   status === "authenticated"
                  ? 
                  
                   <Group
                    sx={{ height: "100%" }}
                    spacing={0}
                    className={classes.hiddenMobile}
                    >
                    <Link href="/profile" leftIcon={<IconWallet size={14} />} className={classes.link}>
                        <Avatar radius="xl" />My Profile
                      </Link>
                      <Button leftIcon={<IconWallet size={14} />} color="green" onClick={() => signOut({ redirect: "/" })}>
                        Sign out
                      </Button>
                  </Group>
                  : 
                   loginProgress 
                   ? 
                    <Button onClick={handleAuth} leftIcon={<IconWallet size={14} />} color="orange" loading loaderPosition="center">Login via Metamask</Button>
                   : 
                  <Button onClick={handleAuth} leftIcon={<IconWallet size={14} />} color="orange" >Login via Metamask</Button>
                :
              <Text fw={700} c={"orange"}>
                  It apprears that Metamask is not installed, <br />
                  Download <a href="https://metamask.io/" target="_blank">Metamask</a> to continue.
              </Text>
            }
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={32} /> : <IconMoonStars size={32} />}
          </ActionIcon>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <Center inline>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={30} /> : <IconMoonStars size={30} />}
            </ActionIcon>
        </Center>
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />
          <Link href="/" className={classes.link}>
            Home
          </Link>
          {/* <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown size={16} color={theme.fn.primaryColor()} />
            </Center>
          </UnstyledButton> */}
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            Learn
          </a>
          { status === "authenticated" ?
          <Link href="/profile" className={classes.link}>
              <Avatar radius="xl" />My Profile
          </Link>
          : null}

          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Group position="center" grow pb="xl" px="md">
          {metamask 
                ? 
                   status === "authenticated"
                  ? 
                  <>
              
                    <Button leftIcon={<IconWallet size={14} />} color="green" onClick={() => signOut({ redirect: "/" })}>
                      Sign out
                    </Button>
                  </>  
                  : 
                   loginProgress 
                   ? 
                    <Button onClick={handleAuth} leftIcon={<IconWallet size={14} />} color="orange" loading loaderPosition="center">Login via Metamask</Button>
                   : 
                  <Button onClick={handleAuth} leftIcon={<IconWallet size={14} />} color="orange" >Login via Metamask</Button>
                :
              <Text fw={700} c={"orange"}>
                  It apprears that Metamask is not installed, <br />
                  Download <a href="https://metamask.io/" target="_blank">Metamask</a> to continue.
              </Text>
            }
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

