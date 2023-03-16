while [[ "$#" -gt 0 ]]
do case $1 in
    -f|--foo) foo="$2"
    shift;;
    -b|--bar) bar="$2"
esac
shift
done
echo "foo: $foo"
echo "bar: $bar"
