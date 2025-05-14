case "$(which node 2>/dev/null)" in
  *bun-node*)
    ;;  # do nothing
  *)
    printf "\e[1m\e[33mWarning: Run commands with \"bun run --bun <command>\".\e[0m\n"
    echo "Giving you a moment to cancel…"
    sleep 1.7
    ;;
esac
